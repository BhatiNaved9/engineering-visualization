/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LineTypeDefinition, SyllabusModule } from '../types/cad';

export const BTU_COURSE_INFO = {
  university: 'Bikaner Technical University (BTU)',
  courseCode: '1FY2-28',
  courseName: 'ENGINEERING VISUALIZATION',
  degree: 'B.Tech 1st & 2nd Semester',
  branches: 'Common to all branches of UG Engineering & Technology',
  credits: 1.5,
  contactHours: '0L + 0T + 3P',
  totalMarks: 100,
  internalAssessment: 60,
  endTermExamination: 40,
  examDuration: '3 Hours',
  standardCode: 'Bureau of Indian Standards (BIS SP 46:2003 / ISO 128)',
};

export const COURSE_OBJECTIVES = [
  'To provide the basic understanding of engineering drawing and graphics and the tools used in engineering visualization.',
  'To introduce conventional symbols, procedures and standards used in engineering drawings.',
  'To provide first-level 3D modelling skills using computer packages.',
  'To enable students to create and read professional engineering drawings.',
];

export const COURSE_OUTCOMES = [
  { code: 'CO-1', description: 'Create 3D models of engineering components and assemblies.' },
  { code: 'CO-2', description: 'Create and read professional engineering drawings complying with BIS standards.' },
  { code: 'CO-3', description: 'Visualize a product in various ways (orthographic, isometric, sectional, exploded).' },
];

export const LINE_TYPES_CATALOG: LineTypeDefinition[] = [
  {
    id: 'continuous-thick',
    name: 'Continuous Thick Line (Type A)',
    bisCode: 'A (0.50 mm)',
    description: 'Thick, solid, continuous line used for representing visible outlines and visible edges of objects.',
    thickness: '0.50 mm',
    dashPattern: 'none',
    color: '#38bdf8',
    usage: ['Visible outlines', 'Visible edges of parts', 'Crests of screw threads', 'Main boundaries'],
    exampleContext: 'Outlines of the 3D model in Front, Top and Side views.',
  },
  {
    id: 'continuous-thin',
    name: 'Continuous Thin Line (Type B)',
    bisCode: 'B (0.25 mm)',
    description: 'Thin, solid, continuous line used for dimension lines, extension lines, leaders, hatching lines, and construction geometry.',
    thickness: '0.25 mm',
    dashPattern: 'none',
    color: '#94a3b8',
    usage: ['Dimension lines', 'Extension / projection lines', 'Hatching (section) lines', 'Leader lines', 'Outlines of revolved sections'],
    exampleContext: 'Dimensioning a 50mm shaft diameter with arrowheads.',
  },
  {
    id: 'dashed-thin',
    name: 'Dashed Thin Line (Type F - Hidden Line)',
    bisCode: 'F (0.25 mm / 0.35 mm)',
    description: 'Evenly spaced dashes (approx 3mm dash, 1mm gap) representing hidden outlines and internal features not directly visible.',
    thickness: '0.25 mm',
    dashPattern: '6, 3',
    color: '#f59e0b',
    usage: ['Hidden outlines', 'Hidden edges', 'Internal bores and keyways'],
    exampleContext: 'Internal counterbore hole inside a solid bearing housing.',
  },
  {
    id: 'chain-thin',
    name: 'Long-Dashed Dotted Thin Line (Type G - Centerline)',
    bisCode: 'G (0.25 mm)',
    description: 'Long dash (10-12mm), gap (1.5mm), dot, gap (1.5mm). Used for axes of symmetry, center lines, and pitch circles.',
    thickness: '0.25 mm',
    dashPattern: '14, 3, 2, 3',
    color: '#ec4899',
    usage: ['Center lines', 'Axes of revolution (cylinders, cones)', 'Lines of symmetry', 'Pitch circles of gears and bolt PCD'],
    exampleContext: 'Symmetry axis passing through the center of a cylinder.',
  },
  {
    id: 'chain-thick-ends',
    name: 'Cutting Plane Line (Type H)',
    bisCode: 'H (0.50 mm ends, 0.25 mm middle)',
    description: 'Long dashed dotted thin with thick ends and direction-of-sight arrows pointing in the viewing direction.',
    thickness: '0.50 mm / 0.25 mm',
    dashPattern: '16, 4, 3, 4',
    color: '#ef4444',
    usage: ['Cutting planes', 'Section plane indicators A-A, B-B'],
    exampleContext: 'Indicating where the section plane cuts through the piston.',
  },
  {
    id: 'break-thin',
    name: 'Continuous Thin Freehand / Zig-Zag Line (Type C/D)',
    bisCode: 'C / D (0.25 mm)',
    description: 'Freehand wavy or zig-zag line indicating limits of partial or interrupted views and sections.',
    thickness: '0.25 mm',
    dashPattern: 'none',
    color: '#a855f7',
    usage: ['Long break lines', 'Short break lines', 'Interrupted views of long shafts'],
    exampleContext: 'Shortening a long 2-meter steel rod on a drawing sheet.',
  },
];

export const PENCIL_GRADES = [
  { grade: '4H', hardness: 'Very Hard', use: 'Construction lines, reference grid, projection lines (very light)' },
  { grade: '2H', hardness: 'Hard', use: 'Dimension lines, extension lines, centerlines, section hatch lines' },
  { grade: 'H', hardness: 'Medium Hard', use: 'Hidden lines, arrowheads, lettering, drawing outlines (first pass)' },
  { grade: 'HB', hardness: 'Medium Soft', use: 'Final visible outlines, border lines, title block text' },
  { grade: 'B / 2B', hardness: 'Soft', use: 'Freehand sketching, artistic shading, engineering conceptual ideation' },
];

export const DRAWING_SHEET_SIZES = [
  { name: 'A0', width: 841, height: 1189, margin: 20, border: 10, area: '1.00 m²' },
  { name: 'A1', width: 594, height: 841, margin: 20, border: 10, area: '0.50 m²' },
  { name: 'A2', width: 420, height: 594, margin: 10, border: 10, area: '0.25 m²' },
  { name: 'A3', width: 297, height: 420, margin: 10, border: 10, area: '0.125 m² (Standard Lab Sheet)' },
  { name: 'A4', width: 210, height: 297, margin: 10, border: 5, area: '0.0625 m²' },
];

export const PRACTICAL_ROADMAP_14_WEEKS = [
  {
    week: 1,
    title: 'Projection of Points',
    goal: 'Understand HP, VP, and 4 Quadrants. Plot points in space and draw elevations and plans.',
    labTasks: ['Point above HP and in front of VP', 'Point in 2nd, 3rd, and 4th quadrants', 'Points on reference planes'],
  },
  {
    week: 2,
    title: 'Projection of Lines & Basic Drawing Commands',
    goal: 'Determine true lengths, apparent lengths, and inclination angles theta (with HP) and phi (with VP).',
    labTasks: ['Line parallel to both HP and VP', 'Line inclined to one plane and parallel to other', 'Line inclined to both planes (Trapezoid method)'],
  },
  {
    week: 3,
    title: '3D Solid Model + Four Views + Isometric View',
    goal: 'Generate Front, Top, Left/Right Side views and Isometric projection of basic polyhedra.',
    labTasks: ['Cube, Prism, Pyramid modelling', 'Deriving orthographic views', 'Isometric scale reduction factor (~0.816)'],
  },
  {
    week: 4,
    title: '2D/3D Drawing + Well-Constrained Sketching',
    goal: 'Master 2D sketch constraints (coincident, horizontal, tangent, concentric) and Extrude Add/Cut.',
    labTasks: ['Fully constrained bracket profile', 'Extrude boss with draft', 'Revolve cylinder with bore'],
  },
  {
    week: 5,
    title: 'Advanced 3D Modelling Features',
    goal: 'Implement Extrude/Revolve cuts, 3D sketch, Sweep, Rib, Loft, and Draft operations.',
    labTasks: ['Stiffener rib creation on angle plate', 'Swept pipe elbow', 'Lofted transition duct'],
  },
  {
    week: 6,
    title: 'Projection of Solids & First vs Third Angle',
    goal: 'Orient solids with axis inclined to HP and parallel to VP, and compare 1st vs 3rd angle rules.',
    labTasks: ['Hexagonal prism resting on corner', 'Cone resting on generator', 'First vs Third angle comparison on sheet'],
  },
  {
    week: 7,
    title: 'Isometric Views from Projections (Reverse Visualization)',
    goal: 'Reconstruct 3D isometric representation from given orthographic front and top views.',
    labTasks: ['Isometric box method', 'Offset coordinate method for irregular solids', 'Reversing ambiguous 2D drawings'],
  },
  {
    week: 8,
    title: 'Sectional Views & Deriving 3D from Orthographic',
    goal: 'Apply cutting planes (AIP, AVP), hatch sectional surfaces, and obtain true shape of section.',
    labTasks: ['Sectional elevation of cylinder cut by inclined plane', 'True shape of sectional ellipse', 'Half section of flanged pulley'],
  },
  {
    week: 9,
    title: 'Dimensioning, Detail Drawing & Manufacturing Tolerances',
    goal: 'Standard dimensioning systems (Aligned vs Unidirectional), tolerances, surface finish symbols.',
    labTasks: ['Complete detail drawing with title block', 'Dimension placement rules per BIS SP 46', 'Limits and fits intro'],
  },
  {
    week: 10,
    title: 'Assembly Modelling I: Structural & Mechanical Elements',
    goal: 'Assemble multi-part components using rigid, revolute, and slider mates.',
    labTasks: ['Steel A-Frame structure', 'Street-light lamp post assembly', 'Piston-Cylinder sub-assembly'],
  },
  {
    week: 11,
    title: 'Assembly Modelling II: Complex Industrial Mechanisms',
    goal: 'Multi-part mechanical kinematics, exploded views, and Bill of Materials (BOM).',
    labTasks: ['Pin Stapler assembly', 'Induction Motor rotor & stator housing', 'Backhoe arm kinematic link'],
  },
  {
    week: 12,
    title: 'Assembly Modelling III: Civil & Mechanical Systems',
    goal: 'Reinforced concrete beam drawing, skateboard truck assembly, and chain link.',
    labTasks: ['RCC beam reinforcement detailing', 'Skateboard axle assembly', 'Metal chain link array'],
  },
  {
    week: 13,
    title: 'Parametric Modelling & Design Intent',
    goal: 'Design tables, equations, parameterization for helical springs, propellers, shock absorbers.',
    labTasks: ['Helical compression spring with square ends', 'Marine propeller blade sweep', 'Foldable technical table mechanism'],
  },
  {
    week: 14,
    title: 'Comprehensive Portfolio & Production-Ready Drawings',
    goal: 'Exporting professional multi-sheet drawing packets with title blocks and annotations for evaluation.',
    labTasks: ['Complete machine component portfolio', 'Viva-voce examination preparation', 'Drawing analysis audit'],
  },
];

export const BTU_SYLLABUS_MODULES: SyllabusModule[] = [
  {
    id: 1,
    title: 'Introduction to Engineering Drawing, Graphics and Visualization',
    code: 'MOD-01',
    lectureHours: '3 Hours',
    objectives: [
      'Understand engineering drawing as the universal language of engineers.',
      'Identify standard drawing tools and compare manual drafting vs CAD packages.',
      'Understand pencil grades and their standard graphical applications.',
    ],
    topics: [
      {
        title: 'Engineering Drawing as Engineering Language',
        description: 'Why graphical communication precedes written and mathematical language in technical design.',
        keyPoints: ['Unambiguous communication', 'Global standards (ISO & BIS)', 'Shape, size, and material specification'],
      },
      {
        title: 'Drawing Instruments & Board Equipment',
        description: 'Drawing board, mini-drafter, T-square, set-squares (45° and 30°-60°), compass, divider, protractor, scales, French curves.',
        keyPoints: ['Proper drafter alignment', 'Eliminating parallax error', 'Care and maintenance of compass lead'],
      },
      {
        title: 'CAD Packages in Modern Industry',
        description: 'Evolution from 2D drafting to parametric 3D CAD: SolidWorks, AutoCAD, CATIA, Creo, Onshape, Fusion 360.',
        keyPoints: ['Parametric feature-based modelling', 'Associative 2D drawings', 'Kinematic assembly simulation'],
      },
      {
        title: 'Pencil Grades & Drawing Media',
        description: 'Hardness scale from 9H to 9B. 4H for construction lines, 2H for dimensioning, H for lettering, HB for outlines.',
        keyPoints: ['Lead composition (graphite + clay)', 'Line density contrast', 'Preventing smudge and paper indentation'],
      },
    ],
    labExercises: ['Drawing tools identification quiz', 'Drafting board setup and border ruling', 'Pencil hardness line comparison'],
    practicalWeek: [1],
  },
  {
    id: 2,
    title: 'Engineering Drawing Rules & Line Conventions',
    code: 'MOD-02',
    lectureHours: '3 Hours',
    objectives: [
      'Master Bureau of Indian Standards (BIS SP 46:2003) line types and thicknesses.',
      'Apply standardized dimensioning techniques and rules.',
      'Understand representative fractions (RF) and engineering scales.',
    ],
    topics: [
      {
        title: 'Standard Line Types (BIS / ISO 128)',
        description: 'Continuous thick, continuous thin, dashed thin (hidden), chain thin (centerline), cutting plane line.',
        keyPoints: ['Thickness ratios 2:1 between thick and thin', 'Standard dash lengths: 3mm dash, 1mm gap', 'Centerline extensions 2-3mm beyond outline'],
      },
      {
        title: 'Dimensioning Principles',
        description: 'Aligned system vs Unidirectional system. Placement of dimension lines, extension lines, leaders, and arrowheads.',
        keyPoints: ['Never dimension inside the view unless unavoidable', 'Dimension lines must never cross each other', 'Arrowhead ratio length:width = 3:1'],
      },
      {
        title: 'Engineering Scales & Representative Fraction',
        description: 'Full size (1:1), Reducing scales (1:2, 1:5, 1:10), Enlarging scales (2:1, 5:1, 10:1). Plain, diagonal, and vernier scales.',
        keyPoints: ['RF = Length on drawing / Actual length of object', 'Maximum length to be measured', 'Division of scale units'],
      },
    ],
    labExercises: ['Line types interactive board', 'Dimensioning error detection exercise', 'Plain scale construction for 1:50'],
    practicalWeek: [2],
  },
  {
    id: 3,
    title: 'Projection Concept & Quadrants',
    code: 'MOD-03',
    lectureHours: '4 Hours',
    objectives: [
      'Grasp fundamental projection theory: projectors, planes of projection (VP, HP, PP).',
      'Distinguish First Angle vs Third Angle projection symbols and layouts.',
      'Plot 3D points in space across all four dihedral quadrants.',
    ],
    topics: [
      {
        title: 'Principles of Projection',
        description: 'Observer, object, projection plane, and lines of sight (projectors). Orthographic vs perspective vs axonometric.',
        keyPoints: ['Projectors are parallel and perpendicular to plane', 'True shape preserved on parallel plane', 'Zero distortion in orthographic'],
      },
      {
        title: 'First Angle vs Third Angle Projection',
        description: 'First angle (Object between observer and plane): Front view above, Top view below. Third angle (Plane between observer and object).',
        keyPoints: ['BIS and European practice: First angle', 'US and Canadian practice: Third angle', 'International projection truncated cone symbols'],
      },
      {
        title: 'Projection of Points in 4 Quadrants',
        description: 'Mathematical derivation of elevation (a\') and plan (a) when point is placed in 1st, 2nd, 3rd, or 4th quadrant.',
        keyPoints: ['1st Quad: Above HP, In front of VP', '2nd Quad: Above HP, Behind VP (views overlap)', '3rd Quad: Below HP, Behind VP', '4th Quad: Below HP, In front of VP (views overlap)'],
      },
    ],
    labExercises: ['3D Point quadrant simulator', 'Unfolding horizontal plane animation', 'First vs Third angle conversion'],
    practicalWeek: [1, 2],
  },
  {
    id: 4,
    title: 'Drawing Sheets & Projection of Straight Lines',
    code: 'MOD-04',
    lectureHours: '4 Hours',
    objectives: [
      'Standardize drawing sheet layout (A0-A4) with standard Title Block.',
      'Determine true length (TL) and apparent lengths (EL, PL) of inclined lines.',
      'Calculate true inclinations with HP (theta) and VP (phi) and locate traces.',
    ],
    topics: [
      {
        title: 'Standard Drawing Sheet Layout',
        description: 'Sizes A0, A1, A2, A3, A4. Frame borders, 20mm left margin for binding, grid reference systems, title block (185 x 65 mm).',
        keyPoints: ['Title block contents: Name, Roll, Title, Scale, Symbol', 'Trimmed vs Untrimmed sizes', 'Folding methods of large sheets'],
      },
      {
        title: 'Projection of Straight Lines',
        description: 'Line parallel to both, parallel to one and inclined to other, and inclined to both HP and VP.',
        keyPoints: ['When line is parallel to plane, projection shows True Length', 'Apparent lengths EL and PL are shorter than TL', 'Trapezoid method and rotation method'],
      },
      {
        title: 'Traces of a Line',
        description: 'Horizontal Trace (HT) where line intersects HP; Vertical Trace (VT) where line intersects VP.',
        keyPoints: ['HT coordinates (h, h\')', 'VT coordinates (v, v\')', 'Locus of line points'],
      },
    ],
    labExercises: ['Virtual A3 drawing sheet creator', 'Line inclination calculator with 3D ray trace', 'Trapezoid true length solver'],
    practicalWeek: [2, 3],
  },
  {
    id: 5,
    title: 'Projection of Solids',
    code: 'MOD-05',
    lectureHours: '4 Hours',
    objectives: [
      'Understand classification of solids: polyhedra (prisms, pyramids) and solids of revolution (cylinders, cones, spheres).',
      'Draw orthographic views when solid axis is perpendicular or inclined to reference planes.',
      'Generate isometric views from orthographic projections.',
    ],
    topics: [
      {
        title: 'Classification of Engineering Solids',
        description: 'Regular polyhedra (tetrahedron, hexahedron/cube, octahedron), prisms, pyramids, cylinder, cone, sphere.',
        keyPoints: ['Prism: parallel identical polygonal bases', 'Pyramid: polygonal base with apex', 'Solids of revolution generated by revolving 2D shape'],
      },
      {
        title: 'Solids with Axis Inclined to One Plane',
        description: 'Step-by-step 2-stage projection: initial position with axis perpendicular to plane, second position tilted.',
        keyPoints: ['Base edges/corners resting on plane', 'Determining visible vs hidden base edges', 'Projector alignment between stages'],
      },
      {
        title: 'Isometric Projection of Solids',
        description: 'Isometric axes at 120° apart. Isometric scale = sqrt(2)/sqrt(3) ~= 0.816. Isometric projection vs Isometric view/drawing.',
        keyPoints: ['True scale vs Isometric scale', 'Four-center method for isometric circles', 'Non-isometric lines must be boxed'],
      },
    ],
    labExercises: ['3D Solid visualizer with 4-view generation', 'Stage-1 to Stage-2 tilting animation', 'Four-center isometric ellipse generator'],
    practicalWeek: [3, 6, 7],
  },
  {
    id: 6,
    title: '2D CAD Drawing & Geometric Constraints',
    code: 'MOD-06',
    lectureHours: '4 Hours',
    objectives: [
      'Use 2D CAD entities: lines, arcs, circles, splines, construction lines.',
      'Apply geometric constraints to produce robust parametric sketches.',
      'Recognize Under-constrained, Fully-constrained, and Over-constrained sketches.',
    ],
    topics: [
      {
        title: 'Reference Planes & Sketch Entities',
        description: 'Top, Front, and Right default datum planes. Sketching points, lines, circles, 3-point arcs, centerlines, rectangles.',
        keyPoints: ['Active sketch plane', 'Origin (0,0) as master anchor', 'Construction geometry vs solid geometry'],
      },
      {
        title: 'Geometric Constraints',
        description: 'Horizontal, Vertical, Parallel, Perpendicular, Concentric, Tangent, Equal, Midpoint, Collinear, Coincident.',
        keyPoints: ['Degrees of freedom (DOF) reduction', 'Color codes: Blue (under-constrained), Black (fully constrained), Red (over-constrained)', 'Tangency conditions between arcs and lines'],
      },
      {
        title: 'Editing & Patterning Tools',
        description: 'Fillet, Chamfer, Trim (power trim), Extend, Offset, Mirror, Linear Pattern, Circular Pattern.',
        keyPoints: ['Preserving design intent', 'Parametric dimension driving geometry', 'Symmetry axes'],
      },
    ],
    labExercises: ['Interactive 2D CAD sketcher', 'Constraint solver playground', 'Eliminating degrees of freedom challenge'],
    practicalWeek: [4],
  },
  {
    id: 7,
    title: '3D Solid Modelling Fundamentals',
    code: 'MOD-07',
    lectureHours: '4 Hours',
    objectives: [
      'Create 3D solid geometry from 2D profiles using Extrude Boss and Revolve Boss.',
      'Apply Extrude Cut and Revolve Cut for internal cavities and bores.',
      'Derive associative orthographic views directly from 3D models.',
    ],
    topics: [
      {
        title: 'Extrude Operations',
        description: 'Translating a closed 2D profile along plane normal. Blind, Mid-plane, Up to Next, Up to Surface options, draft angle.',
        keyPoints: ['Profile must be closed and non-intersecting', 'Draft angle for molded/cast parts', 'Thin feature extrude'],
      },
      {
        title: 'Revolve Operations',
        description: 'Revolving a closed 2D sketch around a specified centerline axis by angle (up to 360°).',
        keyPoints: ['Axis of revolution cannot intersect profile', 'Shafts, pulleys, bushings, pressure vessels', 'Revolve cut for counterbores'],
      },
      {
        title: 'Associative Drawing Generation',
        description: 'Generating Front, Top, Right, and Isometric views from 3D solid model with dynamic update link.',
        keyPoints: ['First angle layout on drawing sheet', 'Automatic hidden line rendering', 'Model item dimension import'],
      },
    ],
    labExercises: ['Parametric Extrude & Revolve workbench', 'Step shaft with keyway creation', 'Drawing sheet view projection'],
    practicalWeek: [4, 5],
  },
  {
    id: 8,
    title: 'Complex 3D Modelling & Advanced Features',
    code: 'MOD-08',
    lectureHours: '4 Hours',
    objectives: [
      'Construct complex engineering components using Sweep, Loft, Rib, and Shell.',
      'Apply Fillets (constant radius, variable radius) and Chamfers.',
      'Execute 3D Boolean operations: Union, Subtract, Intersect.',
    ],
    topics: [
      {
        title: 'Sweep & Loft Operations',
        description: 'Sweep: Profile driven along 3D guide curve. Loft: Transitioning between multiple non-parallel cross sections with guide rails.',
        keyPoints: ['Swept pipes, helical springs, wiring harnesses', 'Lofted turbine blades, aerodynamic hoods, transition ducts', 'Start and end tangency constraints'],
      },
      {
        title: 'Engineering Details: Rib, Shell, Draft & Fillet',
        description: 'Stiffener ribs for structural rigidity, uniform thin-wall shelling for injection molding, draft angles, stress-relieving fillets.',
        keyPoints: ['Rib thickness and neutral plane', 'Shelling with coring out', 'Stress concentration reduction via generous fillets'],
      },
      {
        title: 'Boolean Operations in 3D',
        description: 'Solid body interactions: Union (joining bodies), Subtract (cavity carving/tool cutter), Intersect (common volume).',
        keyPoints: ['Multi-body part modelling', 'Tool body vs target body', 'Cavity generation in molds'],
      },
    ],
    labExercises: ['Stiffener rib engineering lab', 'Boolean subtract interactive demo', 'Lofted duct transition workbench'],
    practicalWeek: [5, 8],
  },
  {
    id: 9,
    title: 'Sectioning of Engineering Parts',
    code: 'MOD-09',
    lectureHours: '4 Hours',
    objectives: [
      'Explain the necessity of sectioning to reveal internal features and eliminate confusing hidden lines.',
      'Identify cutting planes (AIP, AVP), section arrows, and standard 45° cross-hatching rules.',
      'Differentiate Full Section, Half Section, Offset Section, Revolved Section, and Removed Section.',
    ],
    topics: [
      {
        title: 'Need for Sectioning & Cutting Plane Lines',
        description: 'Complex machine parts with internal passages become illegible with dashed lines. An imaginary cutting plane exposes internal construction.',
        keyPoints: ['Cutting plane line: thick at ends and bends, thin in between', 'Viewing arrows point towards the part to be retained', 'Section identification labels A-A, B-B'],
      },
      {
        title: 'Section Line Conventions (Hatching)',
        description: 'Continuous thin lines at 45° angle to main outlines. Spacing 1.5mm to 3mm. Adjacent components hatched in opposite directions.',
        keyPoints: ['Never hatch thin webs, ribs, shafts, bolts, nuts, keys along longitudinal axis', 'Hatching interrupted for dimension numerals', 'Standard hatch patterns for cast iron, steel, brass'],
      },
      {
        title: 'Types of Sectional Views',
        description: 'Full section (cutting plane extends entirely across part), Half section (symmetrical parts, 1/4 cut away), Offset section (stepped cutting plane), Revolved and Removed sections.',
        keyPoints: ['Half section shows both exterior and interior simultaneously', 'No centerline between halves in half section', 'Offset cutting plane avoids hatching step boundaries'],
      },
    ],
    labExercises: ['Interactive dynamic cutting plane lab', '45° Cross-hatch simulator', 'Half section vs Full section comparison'],
    practicalWeek: [8, 9],
  },
  {
    id: 10,
    title: 'Assembly Modelling & Mechanical Mates',
    code: 'MOD-10',
    lectureHours: '4 Hours',
    objectives: [
      'Understand bottom-up vs top-down assembly methodologies.',
      'Apply mate connectors: Fastened, Revolute, Slider, Cylindrical, Planar, Tangent.',
      'Generate exploded assembly views with trails and Bill of Materials (BOM).',
    ],
    topics: [
      {
        title: 'Assembly Fundamentals & Part Insertion',
        description: 'Root/ground component fixed in 6 degrees of freedom. Inserting manufactured components from CAD library.',
        keyPoints: ['Fixing the foundational base', 'Managing part colors and transparency', 'Interference and clash detection'],
      },
      {
        title: 'Mate Types & Kinematic Restraints',
        description: 'Revolute mate (1 rotational DOF), Slider mate (1 translational DOF), Cylindrical mate (1 rot + 1 trans), Fastened mate (0 DOF), Planar mate (3 DOF).',
        keyPoints: ['Eliminating unwanted DOFs', 'Mate limits (min and max displacement/angle)', 'Physical motion study'],
      },
      {
        title: 'Exploded Views & Assembly Drawings',
        description: 'Disassembling parts along logical assembly axes with exploded trail lines. Numbered balloons and Bill of Materials (BOM).',
        keyPoints: ['Explosion hierarchy: fasteners first, sub-assemblies next', 'BOM columns: Item No, Part Name, Material, Quantity', 'Balloon callouts attached to visible outlines'],
      },
    ],
    labExercises: ['Piston-Cylinder exploded assembly lab', 'Flange coupling bolt fastening simulation', 'BOM generation workbench'],
    practicalWeek: [10, 11, 12, 13, 14],
  },
];
