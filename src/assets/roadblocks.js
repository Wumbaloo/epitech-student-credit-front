let roadblocks = [
  {
    name: "Crédits",
    credits_obtains: 0,
    credits_needed: 60,
    credits_remains: 0
  },
  {
    name: "Anglais",
    credits_obtains: 0,
    credits_needed: null,
    credits_remains: "N/A"
  },
  {
    name: "Roadblocks",
  },
  {
    name: "Foundation",
    is_roadblock: true,
    credits_obtains: 0,
    credits_needed: 0,
    credits_remains: 0,
    details: [
      { // Tek 1
        needed: 25,
        modules: [
          {codemodule: "B-CPE-100", codeinstance: "1-1"},
          {codemodule: "B-CPE-101", codeinstance: "1-1"},
          {codemodule: "B-CPE-110", codeinstance: "1-1"},
          {codemodule: "B-CPE-111", codeinstance: "1-1"},
          {codemodule: "B-PSU-100", codeinstance: "1-1"},
          {codemodule: "B-PSU-101", codeinstance: "1-1"},
          {codemodule: "B-CPE-200", codeinstance: "2-1"},
          {codemodule: "B-CPE-201", codeinstance: "2-1"},
          {codemodule: "B-PSU-200", codeinstance: "2-1"},
          {codemodule: "B-PSU-210", codeinstance: "2-1"},
          {codemodule: "B-MET-100", codeinstance: "1-1"},
          {codemodule: "B-MET-200", codeinstance: "2-1"},
        ]
      },
      { // Tek 2
        needed: 15,
        modules: [
          {codemodule: "B-CCP-400", codeinstance: "4-1"},
          {codemodule: "B-NWP-400", codeinstance: "4-1"},
          {codemodule: "B-OOP-400", codeinstance: "4-1"},
          {codemodule: "B-PSU-400", codeinstance: "4-1"},
          {codemodule: "B-YEP-400", codeinstance: "4-1"},
          {codemodule: "B-YEP-410", codeinstance: "4-1"},
          {codemodule: "B-CPP-300", codeinstance: "3-1"},
          {codemodule: "B-MET-400", codeinstance: "4-1"}
        ]
      },
      { // Tek 3
        needed: 10,
        modules: [
          {codemodule: "B-CPP-500", codeinstance: "5-1"},
          {codemodule: "B-CPP-501", codeinstance: "5-1"},
          {codemodule: "B-CPP-510", codeinstance: "5-1"},
          {codemodule: "B-DEV-500", codeinstance: "5-1"},
          {codemodule: "B-DEV-501", codeinstance: "5-1"},
          {codemodule: "B-DEV-510", codeinstance: "5-1"},
          {codemodule: "B-FUN-500", codeinstance: "5-1"},
          {codemodule: "B-FUN-501", codeinstance: "5-1"},
          {codemodule: "B-FUN-510", codeinstance: "5-1"}
        ]
      }
    ]
  },
  {
    name: "Supplement",
    is_roadblock: true,
    credits_obtains: 0,
    credits_needed: 0,
    credits_remains: 0,
    details: [
      { // Tek 1
        needed: 8,
        modules: [
          {codemodule: "B-MUL-100", codeinstance: "1-1"},
          {codemodule: "B-MAT-100", codeinstance: "1-1"},
          {codemodule: "B-MUL-200", codeinstance: "2-1"},
          {codemodule: "B-AIA-200", codeinstance: "2-1"},
          {codemodule: "B-SAD-200", codeinstance: "2-1"},
          {codemodule: "B-WEB-200", codeinstance: "2-1"},
          {codemodule: "B-MAT-200", codeinstance: "2-1"},
          {codemodule: "B-SEC-200", codeinstance: "2-1"},
        ]
      },
      { // Tek 2
        needed: 4,
        modules: [
          {codemodule: "B-CNA-410", codeinstance: "4-1"},
          {codemodule: "B-MAT-400", codeinstance: "4-1"},
          {codemodule: "B-NSA-400", codeinstance: "4-1"},
          {codemodule: "B-SHL-400", codeinstance: "4-1"},
          {codemodule: "B-PSU-402", codeinstance: "4-1"},
          {codemodule: "B-ASM-400", codeinstance: "4-1"},
          {codemodule: "B-FUN-400", codeinstance: "4-1"},
          {codemodule: "B-SEC-400", codeinstance: "4-1"}
        ]
      },
      { // Tek 3
        needed: 1,
        modules: [
          {codemodule: "B-AIA-500", codeinstance: "5-1"},
          {codemodule: "B-MAT-500", codeinstance: "5-1"},
          {codemodule: "B-SEC-500", codeinstance: "5-1"},
          {codemodule: "B-DOP-500", codeinstance: "5-1"}
        ]
      }
    ]
  },
  {
    name: "Innovation",
    is_roadblock: true,
    credits_obtains: 0,
    credits_needed: 0,
    credits_remains: 0,
    details: [
      { // Tek 1
        needed: 4,
        modules: [
          {codemodule: "B-INN-200", codeinstance: "2-1"},
          {codemodule: "G-JAM-001", codeinstance: "0-1"},
          {codemodule: "G-JAM-001", codeinstance: "0-2"},
          {codemodule: "G-JAM-001", codeinstance: "0-3"},
          {codemodule: "G-CUS-001", codeinstance: "0-1"}, {codemodule: "G-CUS-002", codeinstance: "0-1"},
          {codemodule: "G-CUS-003", codeinstance: "0-1"}, {codemodule: "G-CUS-004", codeinstance: "0-1"},
          {codemodule: "G-CUS-005", codeinstance: "0-1"}, {codemodule: "G-CUS-006", codeinstance: "0-1"},
          {codemodule: "G-CUS-007", codeinstance: "0-1"}, {codemodule: "G-CUS-008", codeinstance: "0-1"},
          {codemodule: "G-CUS-009", codeinstance: "0-1"},
        ]
      },
      { // Tek 2
        needed: 4,
        modules: [
          {codemodule: "B-INN-400"},
          {codemodule: "G-JAM-001", codeinstance: "0-1"},
          {codemodule: "G-JAM-001", codeinstance: "0-2"},
          {codemodule: "G-JAM-001", codeinstance: "0-3"},
          {codemodule: "G-CUS-001", codeinstance: "0-1"}, {codemodule: "G-CUS-002", codeinstance: "0-1"},
          {codemodule: "G-CUS-003", codeinstance: "0-1"}, {codemodule: "G-CUS-004", codeinstance: "0-1"},
          {codemodule: "G-CUS-005", codeinstance: "0-1"}, {codemodule: "G-CUS-006", codeinstance: "0-1"},
          {codemodule: "G-CUS-007", codeinstance: "0-1"}, {codemodule: "G-CUS-008", codeinstance: "0-1"},
          {codemodule: "G-CUS-009", codeinstance: "0-1"},
        ]
      },
      { // Tek 3
        needed: 13,
        modules: [
          {codemodule: "B-INN-500", codeinstance: "5-1"},
          {codemodule: "B-EIP-500", codeinstance: "FR-5-1"},
          {codemodule: "B-MOO-500", codeinstance: "5-1"},
          {codemodule: "B-MOO-501", codeinstance: "5-1"},
          {codemodule: "B-MOO-502", codeinstance: "5-1"},
          {codemodule: "B-PRO-500", codeinstance: "5-1"},
          {codemodule: "G-JAM-001", codeinstance: "0-1"},
          {codemodule: "G-JAM-001", codeinstance: "0-2"},
          {codemodule: "G-JAM-001", codeinstance: "0-3"},
          {codemodule: "G-CUS-001", codeinstance: "0-1"}, {codemodule: "G-CUS-002", codeinstance: "0-1"},
          {codemodule: "G-CUS-003", codeinstance: "0-1"}, {codemodule: "G-CUS-004", codeinstance: "0-1"},
          {codemodule: "G-CUS-005", codeinstance: "0-1"}, {codemodule: "G-CUS-006", codeinstance: "0-1"},
          {codemodule: "G-CUS-007", codeinstance: "0-1"}, {codemodule: "G-CUS-008", codeinstance: "0-1"},
          {codemodule: "G-CUS-009", codeinstance: "0-1"},
        ]
      }
    ]
  },
  {
    name: "Soft Skills",
    is_roadblock: true,
    credits_obtains: 0,
    credits_needed: 0,
    credits_remains: 0,
    details: [
      { // Tek 1
        needed: 3,
        modules: [
          {codemodule: "B-ANG-001"},
          {codemodule: "B-FRE-100"}, {codemodule: "B-FRE-200"},
          {codemodule: "B-PCP-000"},
          {codemodule: "G-EPI-004"}, {codemodule: "G-EPI-010"},
          {codemodule: "G-FRE-010"}
        ]
      },
      { // Tek 2
        needed: 3,
        modules: [
          {codemodule: "B-FRE-400"}, {codemodule: "B-PCP-000"},
          {codemodule: "G-EPI-004"}, {codemodule: "B-ANG-001"},
          {codemodule: "G-EPI-010"}
        ]
      },
      { // Tek 3
        needed: 3,
        modules: [
          {codemodule: "B-FRE-501"}, {codemodule: "B-ANG-001"},
          {codemodule: "B-PCP-000"}, {codemodule: "G-FRE-010"},
          {codemodule: "G-EPI-010"}, {codemodule: "G-EPI-004"}
        ]
      }
    ]
  }
];

export { roadblocks };