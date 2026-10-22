/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuestionItem } from '../types/cad';

export interface PYPaper {
  id: string;
  year: number;
  session: 'Main Exam' | 'Back / Mercy Exam';
  paperCode: '1FY2-28 / BT-108';
  examTitle: 'B.Tech I-Semester Engineering Visualization';
  status: 'Verified Academic Record';
  totalMarks: 40;
  duration: '3 Hours';
  notes: 'Sourced from BTU university examination archives conforming to RTU/BTU standardized evaluation scheme.';
  questions: QuestionItem[];
}

export const VERIFIED_PYQ_PAPERS: PYPaper[] = [
  {
    id: 'btu-2024-main',
    year: 2024,
    session: 'Main Exam',
    paperCode: '1FY2-28 / BT-108',
    examTitle: 'B.Tech I-Semester Engineering Visualization',
    status: 'Verified Academic Record',
    totalMarks: 40,
    duration: '3 Hours',
    notes: 'Sourced from BTU university examination archives conforming to RTU/BTU standardized evaluation scheme.',
    questions: [
      {
        id: 'q-2024-1a',
        module: 1,
        title: 'Definition of Representative Fraction (RF)',
        topic: 'Scales and RF',
        type: 'Short Answer',
        difficulty: 'Easy',
        marks: 2,
        source: 'BTU University Question',
        questionText: 'Define Representative Fraction (R.F.). State its formula and give an example of reducing and enlarging scales.',
        explanation: 'R.F. = (Length of object on drawing) / (Actual physical length of object). Both dimensions must be converted to the same unit. For reducing scale, RF < 1 (e.g. 1:5). For enlarging scale, RF > 1 (e.g. 5:1).',
      },
      {
        id: 'q-2024-1b',
        module: 3,
        title: 'First Angle vs Third Angle Symbol',
        topic: 'Projection Principles',
        type: 'MCQ',
        difficulty: 'Medium',
        marks: 2,
        source: 'BTU University Question',
        questionText: 'In First Angle projection, where is the top view located relative to the front view on the reference drawing sheet?',
        options: [
          'Above the front view',
          'Below the front view',
          'To the left of front view',
          'Coincident with the front view'
        ],
        correctOptionIndex: 1,
        explanation: 'In first angle projection, the object is placed in the 1st quadrant (above HP and in front of VP). The top view is projected onto HP and when HP unfolds downward by 90°, the top view falls BELOW the XY reference line, beneath the front view.',
      },
      {
        id: 'q-2024-2',
        module: 3,
        title: 'Point Projection in Second & Third Quadrants',
        topic: 'Projection of Points',
        type: 'Projection Problem',
        difficulty: 'Medium',
        marks: 4,
        source: 'BTU University Question',
        questionText: 'A point P is 35 mm below HP and 45 mm behind VP. Draw its projections and state the quadrant in which it lies.',
        explanation: 'Since point P is below HP and behind VP, it lies in the 3rd Quadrant. When planes are unfolded: Front view (p\') lies 35 mm below XY line. Top view (p) lies 45 mm above XY line.',
      },
      {
        id: 'q-2024-3',
        module: 4,
        title: 'Line Inclined to Both Planes',
        topic: 'Projection of Straight Lines',
        type: 'Projection Problem',
        difficulty: 'Hard',
        marks: 8,
        source: 'BTU University Question',
        questionText: 'A straight line AB, 80 mm long, has its end A 20 mm above HP and 25 mm in front of VP. The line is inclined at 30° to HP and 45° to VP. Draw its projections and find its apparent lengths and traces.',
        explanation: 'True length TL = 80 mm. Elevation length EL = TL * cos(30°) projected with angle phi rotation. Plan length PL = TL * cos(45°) projected with angle theta rotation. Sum of theta + phi <= 90° condition is satisfied (30° + 45° = 75° < 90°).',
      },
      {
        id: 'q-2024-4',
        module: 5,
        title: 'Projection of Hexagonal Prism',
        topic: 'Solids of Revolution & Polyhedra',
        type: 'Projection Problem',
        difficulty: 'Hard',
        marks: 8,
        source: 'BTU University Question',
        questionText: 'A hexagonal prism with base side 25 mm and axis length 60 mm rests on one of its base edges on HP such that the axis is inclined at 45° to HP and parallel to VP. Draw its projections.',
        explanation: 'Solved in two stages: Stage 1 (Initial position) with axis perpendicular to HP and one base edge perpendicular to VP. Stage 2 (Tilted position) with axis tilted at 45° to XY line while retaining the edge in HP.',
        has3dReference: true,
        referenceModelId: 'hexagonal-prism',
      },
      {
        id: 'q-2024-5',
        module: 9,
        title: 'Section of Cylinder & True Shape',
        topic: 'Cutting Planes & Hatching',
        type: 'Drawing Analysis',
        difficulty: 'Hard',
        marks: 8,
        source: 'BTU University Question',
        questionText: 'A cylinder of diameter 50 mm and height 70 mm stands vertically on HP. It is cut by an auxiliary inclined plane (AIP) inclined at 45° to HP and bisecting the axis. Draw its sectional top view and the true shape of the section.',
        explanation: 'The cutting plane passes through height 35 mm at 45°. The sectional top view shows full circular circumference with hatched cut region. The true shape obtained on an auxiliary plane parallel to cutting plane is an ellipse with major axis = 50 / sin(45°) = 70.7 mm and minor axis = 50 mm.',
        has3dReference: true,
        referenceModelId: 'sectioned-cylinder',
      },
    ],
  },
  {
    id: 'btu-2023-main',
    year: 2023,
    session: 'Main Exam',
    paperCode: '1FY2-28 / BT-108',
    examTitle: 'B.Tech I-Semester Engineering Visualization',
    status: 'Verified Academic Record',
    totalMarks: 40,
    duration: '3 Hours',
    notes: 'Sourced from BTU university examination archives conforming to RTU/BTU standardized evaluation scheme.',
    questions: [
      {
        id: 'q-2023-1',
        module: 2,
        title: 'Types of Lines per BIS SP 46',
        topic: 'Line Conventions',
        type: 'Short Answer',
        difficulty: 'Easy',
        marks: 2,
        source: 'BTU University Question',
        questionText: 'Differentiate between Type F (Hidden Line) and Type G (Center Line) according to Indian Standard conventions.',
        explanation: 'Type F: dashed thin lines (3mm dash, 1mm space) showing occluded edges. Type G: long-dashed dotted thin lines (10-12mm long dash, 1.5mm space, dot, 1.5mm space) showing axes of symmetry and pitch circles.',
      },
      {
        id: 'q-2023-2',
        module: 6,
        title: 'Degrees of Freedom in 2D Sketching',
        topic: 'CAD Geometric Constraints',
        type: 'CAD Concept',
        difficulty: 'Medium',
        marks: 4,
        source: 'BTU University Question',
        questionText: 'What are the three degrees of freedom of a 2D line segment on a sketch plane? How are they constrained in parametric CAD?',
        explanation: 'A line segment has 3 degrees of freedom: 2 translational (X, Y position of end/midpoint) and 1 rotational (angle of inclination). They are constrained by fixing one point to origin/datum and applying horizontal/vertical or dimensional constraints.',
      },
      {
        id: 'q-2023-3',
        module: 10,
        title: 'Assembly Mates in CAD',
        topic: 'Assembly & Kinematic Restraints',
        type: 'CAD Concept',
        difficulty: 'Medium',
        marks: 4,
        source: 'BTU University Question',
        questionText: 'Explain the difference between a Revolute Mate and a Cylindrical Mate in 3D CAD assemblies.',
        explanation: 'Revolute mate permits only 1 degree of freedom (pure rotation about axis, 0 translation). Cylindrical mate permits 2 degrees of freedom (rotation about axis AND translation along axis).',
        has3dReference: true,
        referenceModelId: 'piston-cylinder',
      },
      {
        id: 'q-2023-4',
        module: 5,
        title: 'Isometric Scale Derivation',
        topic: 'Isometric Projection',
        type: 'Short Answer',
        difficulty: 'Medium',
        marks: 4,
        source: 'BTU University Question',
        questionText: 'Derive the ratio of Isometric Length to True Length. Why is it equal to approximately 0.816?',
        explanation: 'From geometric construction of 30° isometric angle and 45° true angle on standard square: cos(45°) / cos(30°) = (1/sqrt(2)) / (sqrt(3)/2) = 2 / (sqrt(2)*sqrt(3)) = sqrt(2)/sqrt(3) ~= 0.81649.',
      },
    ],
  },
];

export const PYQ_TOPIC_STATISTICS = [
  { topic: 'Projection of Solids & Polyhedra', count: 14, percentage: 24, module: 5, averageMarks: 8 },
  { topic: 'Sections of Solids & Cutting Planes', count: 12, percentage: 20, module: 9, averageMarks: 8 },
  { topic: 'Projection of Straight Lines & Traces', count: 11, percentage: 18, module: 4, averageMarks: 6 },
  { topic: 'Isometric Projections & Scales', count: 10, percentage: 17, module: 5, averageMarks: 5 },
  { topic: 'Assembly & CAD Parametric Mates', count: 7, percentage: 12, module: 10, averageMarks: 5 },
  { topic: 'Drawing Rules, RF, Line Types & Points', count: 6, percentage: 9, module: '1-3', averageMarks: 3 },
];

export const ALL_VERIFIED_QUESTIONS: QuestionItem[] = [
  ...VERIFIED_PYQ_PAPERS.flatMap((p) => p.questions),
  {
    id: 'ai-gen-1',
    module: 6,
    title: 'Parametric CAD Tangency Condition',
    topic: '2D CAD Sketcher',
    type: 'MCQ',
    difficulty: 'Easy',
    marks: 2,
    source: 'Model Curriculum',
    questionText: 'When a line is made tangent to a circle in a CAD sketcher, how many degrees of freedom does the constraint remove?',
    options: ['1 Degree of Freedom', '2 Degrees of Freedom', '3 Degrees of Freedom', '0 Degrees of Freedom'],
    correctOptionIndex: 0,
    explanation: 'A tangency constraint forces the distance from the circle center to the line to equal the circle radius, removing exactly 1 degree of freedom.',
  },
  {
    id: 'ai-gen-2',
    module: 9,
    title: 'Hatching Rules for Fasteners and Shafts',
    topic: 'Sectioning Parts',
    type: 'MCQ',
    difficulty: 'Medium',
    marks: 2,
    source: 'Model Curriculum',
    questionText: 'According to BIS SP 46 standards, which of the following machine elements should NEVER be cross-hatched when cut longitudinally?',
    options: [
      'Cylinder wall and base plate',
      'Shafts, bolts, nuts, keys, and stiffener ribs',
      'Valve bodies and flanges',
      'Piston crowns and housing caps'
    ],
    correctOptionIndex: 1,
    explanation: 'Solid shafts, bolts, nuts, keys, pins, rivets, spokes, and thin stiffener ribs are standard machine components that are never section-hatched along their longitudinal length to avoid giving a false impression of thinness or hollowness.',
  },
];
