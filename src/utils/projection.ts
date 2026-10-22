/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point3D, ProjectionResult, ProjectionSystem } from '../types/cad';

export const ISOMETRIC_SCALE_FACTOR = Math.sqrt(2) / Math.sqrt(3); // ~0.8165

/**
 * Determine the quadrant of a 3D point relative to HP (Horizontal Plane) and VP (Vertical Plane).
 * In standard Engineering Drawing:
 * - y > 0: Above HP, y < 0: Below HP
 * - z > 0: In front of VP, z < 0: Behind VP
 */
export function getPointQuadrant(y: number, z: number): 1 | 2 | 3 | 4 {
  if (y >= 0 && z >= 0) return 1; // 1st Quadrant: Above HP, In front of VP
  if (y >= 0 && z < 0) return 2;  // 2nd Quadrant: Above HP, Behind VP
  if (y < 0 && z < 0) return 3;  // 3rd Quadrant: Below HP, Behind VP
  return 4;                       // 4th Quadrant: Below HP, In front of VP
}

/**
 * Calculate the projected 2D coordinates on a standard drawing sheet.
 * In 1st Angle Projection (BIS standard for India/BTU):
 * - Front View (elevation, denoted by a') is above XY line by distance = height above HP (y)
 * - Top View (plan, denoted by a) is below XY line by distance = distance in front of VP (z)
 * - Left Side View is on the Right of Front View
 *
 * In 3rd Angle Projection (US/ANSI standard):
 * - Top View (plan) is above XY line
 * - Front View (elevation) is below XY line
 * - Left Side View is on the Left of Front View
 */
export function calculatePointProjection(
  point: Point3D,
  system: ProjectionSystem = 'first-angle'
): ProjectionResult {
  const { x, y, z } = point;
  const quadrant = getPointQuadrant(y, z);

  let frontY: number;
  let topY: number;
  let sideX: number;

  if (system === 'first-angle') {
    // Front View: above XY line (+y)
    frontY = y;
    // Top View: below XY line (-z)
    topY = -z;
    // Right side view is placed on left, left side view is placed on right
    sideX = x + 150;
  } else {
    // 3rd Angle: Top view is above XY line (+z)
    topY = z;
    // Front view is below XY line (-y)
    frontY = -y;
    // Left side view is placed on left
    sideX = x - 150;
  }

  const quadrantNames = {
    1: '1st Quadrant (Above HP, In front of VP)',
    2: '2nd Quadrant (Above HP, Behind VP)',
    3: '3rd Quadrant (Below HP, Behind VP)',
    4: '4th Quadrant (Below HP, In front of VP)',
  };

  return {
    frontView: { x, y: frontY, label: "a' (Elevation / Front)" },
    topView: { x, y: topY, label: "a (Plan / Top)" },
    sideView: { x: sideX, y: frontY, label: "a\" (Profile / Side)" },
    quadrant,
    description: quadrantNames[quadrant],
  };
}

export interface LineProjectionAnalysis {
  trueLength: number;
  apparentElevationLength: number;
  apparentPlanLength: number;
  angleWithHP_Degrees: number; // theta
  angleWithVP_Degrees: number; // phi
  isParallelToHP: boolean;
  isParallelToVP: boolean;
  isPerpendicularToHP: boolean;
  isPerpendicularToVP: boolean;
}

/**
 * Pure mathematical analysis of an engineering line in 3D space.
 * Follows Bureau of Indian Standards (BIS SP 46:2003) and BTU 1FY2-28 Module 4 rules.
 */
export function analyzeLineProjection(
  p1: Point3D,
  p2: Point3D
): LineProjectionAnalysis {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y; // diff in height from HP
  const dz = p2.z - p1.z; // diff in depth from VP

  const trueLength = Math.hypot(dx, dy, dz);
  // Apparent elevation length (projection on VP: dx and dy)
  const apparentElevationLength = Math.hypot(dx, dy);
  // Apparent plan length (projection on HP: dx and dz)
  const apparentPlanLength = Math.hypot(dx, dz);

  // Angle with HP: theta = arcsin(|dy| / trueLength)
  const angleWithHP_Degrees =
    trueLength === 0 ? 0 : (Math.asin(Math.abs(dy) / trueLength) * 180) / Math.PI;

  // Angle with VP: phi = arcsin(|dz| / trueLength)
  const angleWithVP_Degrees =
    trueLength === 0 ? 0 : (Math.asin(Math.abs(dz) / trueLength) * 180) / Math.PI;

  const isParallelToHP = Math.abs(dy) < 0.001;
  const isParallelToVP = Math.abs(dz) < 0.001;
  const isPerpendicularToHP = Math.abs(dx) < 0.001 && Math.abs(dz) < 0.001;
  const isPerpendicularToVP = Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001;

  return {
    trueLength: Number(trueLength.toFixed(2)),
    apparentElevationLength: Number(apparentElevationLength.toFixed(2)),
    apparentPlanLength: Number(apparentPlanLength.toFixed(2)),
    angleWithHP_Degrees: Number(angleWithHP_Degrees.toFixed(1)),
    angleWithVP_Degrees: Number(angleWithVP_Degrees.toFixed(1)),
    isParallelToHP,
    isParallelToVP,
    isPerpendicularToHP,
    isPerpendicularToVP,
  };
}

/**
 * Calculate Isometric length from True length using standard isometric ratio sqrt(2)/sqrt(3)
 */
export function calculateIsometricLength(trueLength: number): number {
  return Number((trueLength * ISOMETRIC_SCALE_FACTOR).toFixed(2));
}
