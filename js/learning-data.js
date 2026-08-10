export const learningRegistry = {
  classes: [
    {
      id: "class-10",
      name: "Class 10",
      subjects: [
        {
          id: "science",
          name: "Science",
          icon: "🔬",
          url: "learning/class-10-science.html",
          chapters: [
            {
              id: "ch-1",
              name: "Chemical Reactions and Equations",
              topicsCount: 4,
              resourceCount: 8,
              difficulty: "Medium",
              description: "Understand the process of chemical change, how to represent it via equations, and how to balance them.",
              url: "#chapter-1"
            },
            {
              id: "ch-2",
              name: "Acids, Bases and Salts",
              topicsCount: 5,
              resourceCount: 10,
              difficulty: "Medium",
              description: "Learn about the chemical properties of acids and bases, pH scale, and important salts.",
              url: "#chapter-2"
            }
          ]
        },
        {
          id: "math",
          name: "Mathematics",
          icon: "📐",
          url: "learning/class-10-math.html",
          chapters: []
        },
        {
          id: "english",
          name: "English",
          icon: "📖",
          url: "learning/class-10-english.html",
          chapters: []
        }
      ]
    },
    {
      id: "class-9",
      name: "Class 9",
      subjects: [
        {
          id: "math",
          name: "Mathematics",
          icon: "📐",
          url: "learning/class-9-math.html",
          chapters: []
        }
      ]
    }
  ],

  // Utility to get all subjects across all classes (for global search/grid)
  getAllSubjects: function() {
    let allSubjects = [];
    this.classes.forEach(cls => {
      cls.subjects.forEach(sub => {
        allSubjects.push({
          classId: cls.id,
          className: cls.name,
          subjectId: sub.id,
          subjectName: sub.name,
          icon: sub.icon,
          url: sub.url
        });
      });
    });
    return allSubjects;
  },

  // Utility to get subjects by class ID
  getSubjectsByClass: function(classId) {
    const cls = this.classes.find(c => c.id === classId);
    return cls ? cls.subjects : [];
  },

  // Utility to get a specific subject's data
  getSubjectData: function(classId, subjectId) {
    const cls = this.classes.find(c => c.id === classId);
    if (!cls) return null;
    return cls.subjects.find(s => s.id === subjectId) || null;
  }
};
