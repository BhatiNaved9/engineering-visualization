/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPointQuadrant,
  calculatePointProjection,
  analyzeLineProjection,
  calculateIsometricLength,
  ISOMETRIC_SCALE_FACTOR
} from './projection';

test('getPointQuadrant identifies all 4 quadrants accurately', () => {
  // 1st: y >= 0, z >= 0 (above HP, in front of VP)
  assert.equal(getPointQuadrant(30, 40), 1);
  // 2nd: y >= 0, z < 0 (above HP, behind VP)
  assert.equal(getPointQuadrant(30, -40), 2);
  // 3rd: y < 0, z < 0 (below HP, behind VP)
  assert.equal(getPointQuadrant(-30, -40), 3);
  // 4th: y < 0, z >= 0 (below HP, in front of VP)
  assert.equal(getPointQuadrant(-30, 40), 4);
});

test('calculatePointProjection respects First Angle Projection convention', () => {
  // Point A: 30 mm above HP (y=30), 40 mm in front of VP (z=40), x=50
  const pt = { x: 50, y: 30, z: 40 };
  const result = calculatePointProjection(pt, 'first-angle');

  assert.equal(result.quadrant, 1);
  // Elevation a' must be above XY line (+y)
  assert.equal(result.frontView.y, 30);
  assert.equal(result.frontView.x, 50);
  // Plan a must be below XY line (-z)
  assert.equal(result.topView.y, -40);
  assert.equal(result.topView.x, 50);
});

test('calculatePointProjection respects Third Angle Projection convention', () => {
  // Point in 3rd quadrant: 30 mm below HP (y=-30), 40 mm behind VP (z=-40), x=50
  // When projected in 3rd angle:
  // Top view is above XY line, front view is below XY line
  const pt = { x: 50, y: -30, z: 40 }; // 40mm in front of VP
  const result = calculatePointProjection(pt, 'third-angle');

  assert.equal(result.topView.y, 40);
  assert.equal(result.frontView.y, 30);
});

test('analyzeLineProjection calculates true length and inclinations with HP and VP', () => {
  // Line parallel to HP (dy=0), inclined to VP
  const p1 = { x: 0, y: 25, z: 0 };
  const p2 = { x: 40, y: 25, z: 30 }; // dx=40, dy=0, dz=30 => true length = 50

  const analysis = analyzeLineProjection(p1, p2);
  assert.equal(analysis.trueLength, 50);
  assert.equal(analysis.isParallelToHP, true);
  assert.equal(analysis.angleWithHP_Degrees, 0);
  // angle with VP: arcsin(30/50) = 36.87 degrees
  assert.equal(Math.round(analysis.angleWithVP_Degrees), 37);
  // apparent plan length: hypot(40, 30) = 50 (true length in plan)
  assert.equal(analysis.apparentPlanLength, 50);
  // apparent elevation length: hypot(40, 0) = 40
  assert.equal(analysis.apparentElevationLength, 40);
});

test('calculateIsometricLength applies standard engineering isometric reduction', () => {
  const trueLen = 100;
  const isoLen = calculateIsometricLength(trueLen);
  // sqrt(2)/sqrt(3) * 100 ~= 81.65
  assert.ok(Math.abs(isoLen - 81.65) < 0.1);
});

import { analyzeEngineeringDrawing } from './drawingAnalyzer';

test('analyzeEngineeringDrawing flags inverted views in First Angle projection', () => {
  const report = analyzeEngineeringDrawing({
    name: 'Bracket Drawing',
    projectionSystem: 'first-angle',
    hasFrontView: true,
    hasTopView: true,
    hasSideView: true,
    viewsAlignedVertically: true,
    viewsAlignedHorizontally: true,
    hasCenterlines: true,
    hasHiddenLines: true,
    hasDimensionText: true,
    hasTitleBlock: true,
    hasProjectionSymbol: true,
    hasInternalHolesWithoutHiddenLine: false,
    topViewAboveFrontInFirstAngle: true, // ERROR: Top view above front view in 1st angle!
  });

  assert.equal(report.reconstructionPossible, true);
  const invertedIssue = report.issues.find(i => i.id === 'err-first-angle-inverted');
  assert.ok(invertedIssue, 'Must flag inverted view arrangement');
  assert.equal(invertedIssue?.severity, 'error');
});

test('analyzeEngineeringDrawing flags insufficient views when only 1 view exists', () => {
  const report = analyzeEngineeringDrawing({
    name: 'Single View Drawing',
    projectionSystem: 'first-angle',
    hasFrontView: true,
    hasTopView: false,
    hasSideView: false,
    viewsAlignedVertically: false,
    viewsAlignedHorizontally: false,
    hasCenterlines: false,
    hasHiddenLines: false,
    hasDimensionText: false,
    hasTitleBlock: false,
    hasProjectionSymbol: false,
    hasInternalHolesWithoutHiddenLine: false,
    topViewAboveFrontInFirstAngle: false,
  });

  assert.equal(report.reconstructionPossible, false);
  assert.equal(report.reconstructionConfidence, 'insufficient');
});

