/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectionSystem } from '../types/cad';

export interface DrawingFeedbackIssue {
  id: string;
  category: 'projection' | 'alignment' | 'line-convention' | 'dimension' | 'geometry';
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  suggestedFix: string;
  affectedView?: 'Front View' | 'Top View' | 'Side View' | 'Sheet Layout';
}

export interface DrawingAnalysisReport {
  overallScore: number;
  projectionScore: number;
  alignmentScore: number;
  lineConventionScore: number;
  dimensionScore: number;
  detectedProjectionSystem: ProjectionSystem;
  detectedViews: string[];
  issues: DrawingFeedbackIssue[];
  reconstructionPossible: boolean;
  reconstructionConfidence: 'high' | 'moderate' | 'insufficient';
  reconstructionNotes: string;
  summary: string;
}

export interface DrawingSampleInput {
  name: string;
  projectionSystem: ProjectionSystem;
  hasFrontView: boolean;
  hasTopView: boolean;
  hasSideView: boolean;
  viewsAlignedVertically: boolean;
  viewsAlignedHorizontally: boolean;
  hasCenterlines: boolean;
  hasHiddenLines: boolean;
  hasDimensionText: boolean;
  hasTitleBlock: boolean;
  hasProjectionSymbol: boolean;
  hasInternalHolesWithoutHiddenLine: boolean;
  topViewAboveFrontInFirstAngle: boolean;
}

/**
 * Deterministic engineering drawing analyzer based on BIS SP 46 / ISO 128 standards.
 * Evaluates drawing layout, alignment, line types, and dimensioning conventions.
 */
export function analyzeEngineeringDrawing(
  input: DrawingSampleInput
): DrawingAnalysisReport {
  const issues: DrawingFeedbackIssue[] = [];
  let projectionScore = 100;
  let alignmentScore = 100;
  let lineConventionScore = 100;
  let dimensionScore = 100;

  const detectedViews: string[] = [];
  if (input.hasFrontView) detectedViews.push('Front Elevation');
  if (input.hasTopView) detectedViews.push('Plan (Top)');
  if (input.hasSideView) detectedViews.push('End Elevation (Side)');

  // 1. Projection System & View Arrangement Check
  if (input.projectionSystem === 'first-angle' && input.topViewAboveFrontInFirstAngle) {
    projectionScore -= 45;
    issues.push({
      id: 'err-first-angle-inverted',
      category: 'projection',
      severity: 'error',
      title: 'Inverted View Arrangement in First Angle Projection',
      description: 'The Top View (Plan) has been placed above the Front View. In standard First Angle Projection (BIS standard), the Top View must strictly be placed BELOW the Front View.',
      suggestedFix: 'Relocate the Plan (Top View) directly beneath the Front Elevation, keeping horizontal projectors aligned.',
      affectedView: 'Sheet Layout',
    });
  }

  if (!input.hasTopView && !input.hasSideView) {
    projectionScore -= 50;
    issues.push({
      id: 'err-insufficient-views',
      category: 'projection',
      severity: 'error',
      title: 'Insufficient Orthographic Views for 3D Definition',
      description: 'Only a single 2D view is provided. A single view cannot uniquely define depth or 3D volumetric geometry.',
      suggestedFix: 'Add at least a Top View (Plan) or Side Profile View with depth dimensions.',
      affectedView: 'Sheet Layout',
    });
  }

  if (!input.hasProjectionSymbol) {
    projectionScore -= 15;
    issues.push({
      id: 'warn-no-proj-symbol',
      category: 'projection',
      severity: 'warning',
      title: 'Missing Projection Symbol in Title Block',
      description: 'The drawing sheet lacks the international truncated cone projection symbol (First Angle or Third Angle).',
      suggestedFix: 'Incorporate the standard truncated cone symbol in the bottom-right title block.',
      affectedView: 'Sheet Layout',
    });
  }

  // 2. Alignment & Projector Check
  if (!input.viewsAlignedVertically && input.hasFrontView && input.hasTopView) {
    alignmentScore -= 40;
    issues.push({
      id: 'err-vertical-projectors',
      category: 'alignment',
      severity: 'error',
      title: 'Projector Misalignment Between Front & Top Views',
      description: 'The vertical projectors connecting corresponding features in the Front Elevation and Plan do not align.',
      suggestedFix: 'Ensure every vertical feature boundary in the Front view projects perpendicularly down into the Top view along a 90° reference line.',
      affectedView: 'Top View',
    });
  }

  if (!input.viewsAlignedHorizontally && input.hasFrontView && input.hasSideView) {
    alignmentScore -= 30;
    issues.push({
      id: 'warn-horizontal-projectors',
      category: 'alignment',
      severity: 'warning',
      title: 'Horizontal Projector Discrepancy with Side View',
      description: 'Height levels in the Front View do not match the corresponding height levels in the Side View.',
      suggestedFix: 'Use horizontal projection lines to transfer height coordinates from Front Elevation directly to End View.',
      affectedView: 'Side View',
    });
  }

  // 3. Line Conventions Check
  if (input.hasInternalHolesWithoutHiddenLine) {
    lineConventionScore -= 35;
    issues.push({
      id: 'err-missing-hidden-lines',
      category: 'line-convention',
      severity: 'error',
      title: 'Missing Hidden Lines (Type F) for Internal Cavities',
      description: 'Internal cylindrical bore or recess is present but not indicated with dashed thin lines in the exterior orthographic view.',
      suggestedFix: 'Add Type F dashed lines (3mm dash, 1mm gap) representing the boundary of internal occluded bore.',
      affectedView: 'Front View',
    });
  }

  if (!input.hasCenterlines) {
    lineConventionScore -= 25;
    issues.push({
      id: 'warn-missing-centerlines',
      category: 'line-convention',
      severity: 'warning',
      title: 'Missing Center Lines (Type G) on Cylindrical Features',
      description: 'Circular and symmetrical elements do not have long-dashed dotted thin center lines extending 2-3mm beyond the outlines.',
      suggestedFix: 'Draw Type G center lines intersecting at the circle center and along the axis of revolution.',
      affectedView: 'Top View',
    });
  }

  // 4. Dimensioning & Title Block
  if (!input.hasDimensionText) {
    dimensionScore -= 40;
    issues.push({
      id: 'err-missing-dimensions',
      category: 'dimension',
      severity: 'error',
      title: 'No Explicit Dimensioning Found',
      description: 'Component outlines lack dimensions, extension lines, or scale declaration. The drawing cannot be fabricated.',
      suggestedFix: 'Apply standard Aligned or Unidirectional dimensioning with 3:1 closed filled arrowheads.',
      affectedView: 'Sheet Layout',
    });
  }

  if (!input.hasTitleBlock) {
    dimensionScore -= 20;
    issues.push({
      id: 'warn-missing-title-block',
      category: 'dimension',
      severity: 'warning',
      title: 'Title Block Missing',
      description: 'Standard 185 mm x 65 mm title block not found in lower right corner (BIS SP 46:2003 requirement).',
      suggestedFix: 'Provide standard Title Block with: Name of institution, Drawing Title, Scale, Sheet No, and Date.',
      affectedView: 'Sheet Layout',
    });
  }

  // Normalization
  projectionScore = Math.max(10, projectionScore);
  alignmentScore = Math.max(10, alignmentScore);
  lineConventionScore = Math.max(10, lineConventionScore);
  dimensionScore = Math.max(10, dimensionScore);

  const overallScore = Math.round(
    projectionScore * 0.3 +
    alignmentScore * 0.25 +
    lineConventionScore * 0.25 +
    dimensionScore * 0.2
  );

  let reconstructionPossible = false;
  let reconstructionConfidence: 'high' | 'moderate' | 'insufficient' = 'insufficient';
  let reconstructionNotes = '';

  if (input.hasFrontView && input.hasTopView && input.viewsAlignedVertically) {
    if (input.hasSideView) {
      reconstructionPossible = true;
      reconstructionConfidence = 'high';
      reconstructionNotes = 'Complete 3-view orthographic definition available. 3D solid reconstruction uniquely resolvable.';
    } else {
      reconstructionPossible = true;
      reconstructionConfidence = 'moderate';
      reconstructionNotes = '2 orthographic views available. Primary volumetric envelope reconstructed, assuming lateral symmetry.';
    }
  } else {
    reconstructionPossible = false;
    reconstructionConfidence = 'insufficient';
    reconstructionNotes = 'Insufficient geometric information. Both Front and Top views with aligned projectors are strictly required for 3D spatial derivation.';
  }

  let summary = '';
  if (overallScore >= 85) {
    summary = 'Drawing complies strongly with BIS SP 46:2003 engineering conventions. High drafting precision.';
  } else if (overallScore >= 60) {
    summary = 'Acceptable baseline, but requires corrective adjustments in projection orientation or line conventions.';
  } else {
    summary = 'Significant geometric and convention discrepancies detected. Review First Angle projection rules before resubmitting.';
  }

  return {
    overallScore,
    projectionScore,
    alignmentScore,
    lineConventionScore,
    dimensionScore,
    detectedProjectionSystem: input.projectionSystem,
    detectedViews,
    issues,
    reconstructionPossible,
    reconstructionConfidence,
    reconstructionNotes,
    summary,
  };
}
