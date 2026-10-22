/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProjectionSystem = 'first-angle' | 'third-angle';

export type ViewOrientation =
  | 'isometric'
  | 'front'
  | 'top'
  | 'right'
  | 'left'
  | 'bottom'
  | 'back';

export type DisplayMode =
  | 'shaded'
  | 'shaded-edges'
  | 'wireframe'
  | 'hidden-lines'
  | 'transparent';

export type CameraMode = 'perspective' | 'orthographic';

export interface Point3D {
  x: number;
  y: number; // height (distance from HP)
  z: number; // depth (distance from VP)
}

export interface Line3D {
  p1: Point3D;
  p2: Point3D;
}

export interface ProjectionResult {
  // Front View on Vertical Plane (VP)
  frontView: { x: number; y: number; label: string };
  // Top View on Horizontal Plane (HP)
  topView: { x: number; y: number; label: string };
  // Side View on Profile Plane (PP)
  sideView: { x: number; y: number; label: string };
  // Quadrant information
  quadrant: 1 | 2 | 3 | 4;
  description: string;
}

export interface CadModelPart {
  id: string;
  name: string;
  color: string;
  meshType: 'box' | 'cylinder' | 'cone' | 'custom';
  position: [number, number, number];
  rotation?: [number, number, number];
  dimensions: { [key: string]: number };
  explodeVector: [number, number, number];
}

export interface CadModelDefinition {
  id: string;
  name: string;
  category: 'primitives' | 'components' | 'assemblies';
  description: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  syllabusModule: number;
  parts: CadModelPart[];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: string[];
}

export interface LineTypeDefinition {
  id: string;
  name: string;
  bisCode: string;
  description: string;
  thickness: string;
  dashPattern: string; // CSS stroke-dasharray
  color: string;
  usage: string[];
  exampleContext: string;
}

export interface SyllabusModule {
  id: number;
  title: string;
  code: string;
  lectureHours: string;
  objectives: string[];
  topics: {
    title: string;
    description: string;
    keyPoints: string[];
  }[];
  labExercises: string[];
  practicalWeek: number[];
}

export interface QuestionItem {
  id: string;
  module: number;
  title: string;
  topic: string;
  type: 'MCQ' | 'Short Answer' | 'Projection Problem' | 'CAD Concept' | 'Drawing Analysis';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  source: 'BTU University Question' | 'Model Curriculum' | 'Practice Standard';
  questionText: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  has3dReference?: boolean;
  referenceModelId?: string;
}

export interface SavedModel {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  type: 'sketch' | 'solid' | 'analysis';
  thumbnailData?: string;
  data: any;
}
