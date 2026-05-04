const STORE_KEY = 'skillshift_planner_v14';
const STORE_PREFIX = 'skillshift_planner_';
const APP_STATE_VERSION = 4;

const DAYS = [
  { key: 'monday', ko: { label: '월요일', short: '월' }, en: { label: 'Monday', short: 'Mon' } },
  { key: 'tuesday', ko: { label: '화요일', short: '화' }, en: { label: 'Tuesday', short: 'Tue' } },
  { key: 'wednesday', ko: { label: '수요일', short: '수' }, en: { label: 'Wednesday', short: 'Wed' } },
  { key: 'thursday', ko: { label: '목요일', short: '목' }, en: { label: 'Thursday', short: 'Thu' } },
  { key: 'friday', ko: { label: '금요일', short: '금' }, en: { label: 'Friday', short: 'Fri' } },
  { key: 'saturday', ko: { label: '토요일', short: '토' }, en: { label: 'Saturday', short: 'Sat' } },
  { key: 'sunday', ko: { label: '일요일', short: '일' }, en: { label: 'Sunday', short: 'Sun' } },
];

const TABS = [
  { id: 'dashboard', labelKey: 'tabs.dashboard' },
  { id: 'parts', labelKey: 'tabs.parts' },
  { id: 'skills', labelKey: 'tabs.skills' },
  { id: 'members', labelKey: 'tabs.members' },
  { id: 'requirements', labelKey: 'tabs.requirements' },
  { id: 'schedule', labelKey: 'tabs.schedule' },
  { id: 'labor', labelKey: 'tabs.labor' },
  { id: 'validation', labelKey: 'tabs.validation' },
  { id: 'settings', labelKey: 'tabs.settings' },
  { id: 'roadmap', labelKey: 'tabs.roadmap' },
];

const I18N = {
  ko: {
    tabs: {
      dashboard: '대시보드',
      parts: '파트 / 스테이션',
      skills: '스킬',
      members: '직원',
      requirements: '요구사항',
      schedule: '스케줄 보드',
      labor: '인건비',
      validation: '검증',
      settings: '설정',
      roadmap: '로드맵',
    },
    header: {
      subtitle: '파트 · 스테이션 · Level/Step 기반 근무표 & 인건비 관리',
    },
    common: {
      save: '저장',
      exportJson: 'JSON 내보내기',
      importJson: 'JSON 가져오기',
      resetAll: '전체 초기화',
      copy: '복사',
      add: '추가',
      delete: '삭제',
      close: '닫기',
      active: '활성',
      inactive: '비활성',
      selected: '선택됨',
      all: '전체',
      settings: '설정',
      language: '언어',
      korean: '한국어',
      english: '영어',
      required: '필수',
      optional: '선택',
      noData: '데이터 없음',
      noItems: '표시할 항목이 없다.',
    },
    messages: {
      saved: '저장됨',
      resetConfirm: '모든 입력 데이터를 삭제하고 빈 상태로 되돌릴까요? 현재 데이터는 삭제됩니다.',
      resetDone: '모든 입력 데이터가 삭제되었습니다',
      jsonImported: 'JSON 가져오기 완료',
      invalidJson: 'JSON 파일을 읽을 수 없습니다.',
      copied: '복사됨',
      copyFailed: '복사에 실패했습니다',
      partNameRequired: 'Part 이름을 입력하세요',
      partSelectRequired: 'Part를 먼저 선택하세요',
      partAdded: 'Part 추가됨',
      partDeleteConfirm: 'Part를 삭제할까요? 관련 직원/스테이션 연결은 남을 수 있습니다.',
      stationNameRequired: 'Station 이름을 입력하세요',
      stationSelectRequired: 'Station을 먼저 선택하세요',
      stationAdded: 'Station 추가됨',
      stationDeleteConfirm: 'Station을 삭제할까요?',
      skillNameRequired: 'Skill 이름을 입력하세요',
      skillAdded: 'Skill 추가됨',
      skillDeleteConfirm: 'Skill을 삭제할까요? 직원에게 부여된 해당 Skill도 제거됩니다.',
      levelAdded: 'Skill 단계 추가됨',
      employeeNameRequired: '직원 이름을 입력하세요',
      employeeAdded: '직원 추가됨',
      employeeDeleteConfirm: '직원을 삭제할까요? 해당 직원의 스케줄 배정도 제거됩니다.',
      requirementAdded: '시간 블록 추가됨',
      requirementDeleteConfirm: '시간 블록을 삭제할까요? 관련 스케줄 배정도 제거됩니다.',
      stationReqAdded: '필요 자리 1개 추가됨',
      stationReqCloned: '같은 자리 1개 추가됨',
      skillSelectRequired: 'Skill을 선택하세요',
      levelSelectRequired: 'Level을 선택하세요',
      stepSelectRequired: 'Step을 선택하세요',
      skillNotFound: 'Skill을 찾을 수 없습니다.',
      skillSaved: '{skill} Level {level} / Step {step} 저장됨',
      levelExistsConfirm: '같은 Skill 안에 동일한 Level / Step이 이미 있습니다. 그래도 추가할까요?',
      scheduled: '배정됨',
      languageSaved: '언어가 변경되었습니다',
    },
    settings: {
      title: '설정',
      subtitle: '언어 전환, 기본 표시값, 광고/피드백 링크, 저장/복원 정책을 관리한다.',
      languageLabel: '언어 전환',
      languageHelp: '앱의 주요 버튼과 섹션 제목을 한국어 또는 영어로 바꾼다. 저장된 데이터 이름은 그대로 유지된다.',
      laborTitle: '인건비 기준',
      budgetLabel: '목표 인건비',
      budgetHelp: '대시보드와 인건비 계산의 기준값이다.',
      ratioLabel: '목표 인건비율',
      ratioHelp: '매출 대비 인건비 비율을 계산할 때 사용한다.',
      supportTitle: '광고 / 피드백',
      supportSubtitle: '광고가 들어갈 자리와 사용자 문의 채널을 따로 분리해 둔다.',
      adTitle: '광고 영역',
      adHelp: 'AdSense, 배너, 제휴 링크처럼 외부 광고를 붙일 수 있는 고정 구역이다.',
      adPlaceholder: '광고가 표시될 자리',
      adNote: '실제 광고 코드는 나중에 이 구역에 연결하면 된다.',
      feedbackTitle: '질문 / 피드백',
      feedbackHelp: '질문을 보낼 메일과 질문 링크를 따로 관리한다.',
      feedbackEmailLabel: '문의 메일',
      feedbackUrlLabel: '질문 링크',
      feedbackEmailHelp: '수정은 막고 복사만 가능하다.',
      feedbackUrlHelp: '아직 공백으로 두고, 나중에 질문 링크를 넣으면 된다.',
      feedbackOpenEmail: '질문 보내기',
      feedbackOpenLink: '질문 링크 열기',
      current: '현재 언어',
      koreanLabel: '한국어',
      englishLabel: '영어',
      uiPreview: 'UI 미리보기',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: '이번 주 스케줄의 운영 가능성, 인건비, 부족한 스테이션을 한눈에 확인한다.',
      budgetEdit: '목표 인건비 수정',
      ratioEdit: '목표 인건비율 수정 %',
      assignedHours: '총 배정 시간',
      totalCost: '총 예상 인건비',
      ratio: '목표 대비 사용률',
      neededSales: '필요 매출',
      completion: '스케줄 완성률',
      highRisk: '고위험',
      unassigned: '미배정',
      skillReplacement: '스킬/대체 이슈',
      budgetProgress: '목표 인건비 진행률',
      partLabor: '파트별 인건비',
      topIssues: '가장 먼저 볼 문제',
      noIssues: '현재 주요 경고 없음',
      noData: '데이터 없음',
      immediateReview: '즉시 확인 필요',
      stationSlotBase: '스테이션 슬롯 기준',
      skillReplacementHint: '스킬 부족 / 대체 없음',
      overBudget: '목표를 {amount} 초과했다.',
      remainingBudget: '남은 인건비 여유: {amount}',
      currentSchedule: '현재 스케줄 기준',
      budgetTarget: '목표 {amount}',
      budgetRatioBase: '목표 인건비율 {ratio}% 기준',
      slotsAssigned: '{assigned}/{total} slots 배정',
      goalMet: '목표 이내',
      goalExceeded: '목표 초과',
    },
    parts: {
      title: 'Parts / Stations',
      subtitle: 'Part는 큰 부서, Station은 실제 배치 위치다. 예: 주방 → 준비, 화구, 프라이, 패스, 세척 / 홀 → 플로어, 캐셔, 러너.',
      partAddTitle: 'Part 추가',
      stationAddTitle: 'Station 추가',
      partName: 'Part 이름',
      stationName: 'Station 이름',
      description: '설명',
      color: '색상',
      active: 'Active',
      inactive: 'Inactive',
      partHeader: 'Part',
      stationHeader: 'Station',
      statusHeader: '상태',
      noParts: '등록된 Part가 없다.',
      noStations: '등록된 Station이 없다.',
      deletePart: '삭제',
      deleteStation: '삭제',
    },
    skills: {
      title: 'Skills / Levels',
      subtitle: '왼쪽에서 Skill을 선택하면 오른쪽에서 그 Skill에 속한 Level / Step을 관리한다. Level / Step은 Skill 밖의 별도 분류가 아니다.',
      guideTitle: '구조 정리',
      guideText: 'Station은 근무 위치, Skill은 그 위치에서 필요한 업무 능력, Level / Step은 선택한 Skill 안에서의 숙련 단계다. 예: Fry section → Level 1 / Step 4.',
      addSkillTitle: 'Skill 추가',
      addStepTitle: 'Level / Step 추가',
      noSkillSelected: '선택된 Skill 없음',
      noSkillSelectedText: '왼쪽에서 Skill을 추가하거나 선택하면 Level / Step 관리 패널이 열린다.',
      noSkillSteps: '이 Skill에는 아직 Level / Step이 없다. 위에서 단계를 추가해라.',
      noSkills: '아직 등록된 Skill이 없다.',
      chooseSkill: 'Skill 선택',
      chooseLevel: 'Level 선택',
      chooseStep: 'Step 선택',
      addLevel: '단계 추가',
      deleteLevel: '삭제',
      deleteSkill: '삭제',
    },
    members: {
      title: 'Members',
      subtitle: '직원별 Part, 가능 요일/시간, 가능 Skill, Level/Step을 관리한다. Part 필터는 Parts 탭의 추가/삭제와 자동 연동된다.',
      partFilter: '보기 Part',
      addEmployeeTitle: '직원 추가',
      name: '이름',
      part: 'Part',
      role: '역할',
      rate: '시급',
      maxHours: '최대 주간시간',
      addEmployee: '직원 추가',
      availability: '근무 가능 요일/시간',
      skillLevelStep: 'Skill별 Level / Step 지정',
      skillStepHelp: 'Skill 안에 정의된 단계 중 하나를 선택한다.',
      assignSkill: 'Skill 추가/갱신',
      removeSkill: '제거',
      noEmployeesHere: '이 Part에 등록된 직원 없음',
      noEmployeesVisible: '선택한 Part에 표시할 직원이 없다.',
      weekHours: '이번 주',
      max: '최대',
      weekday: '평일',
      saturday: '토',
      sunday: '일',
      deactivate: '비활성',
      activate: '활성',
    },
    requirements: {
      title: 'Requirements',
      subtitle: '요일별 시간 블록 안에 필요한 실제 자리만 한 줄씩 추가한다. 같은 자리가 2명 필요하면 같은 Station을 두 번 추가한다.',
      guideTitle: '입력 방식',
      guideText: '예: 디너 피크에 Kitchen/Fry 2명이 필요하면 Kitchen / Fry 자리를 두 번 추가한다. Schedule Board에는 두 줄이 자동 생성되고, 각 줄마다 조건에 맞는 직원만 선택된다.',
      daySelect: '요일 선택',
      addBlockTitle: '시간 블록 추가',
      day: '요일',
      start: '시작',
      end: '종료',
      label: '라벨',
      peak: '피크',
      addBlock: '블록 추가',
      noBlocks: '이 요일에는 아직 시간 블록이 없다.',
      requiredSeats: '필요 자리',
      seat: '자리',
      seatAdd: '자리 1개 추가',
      cloneSeat: '같은 자리 추가',
      deleteBlock: '블록 삭제',
      deleteSeat: '삭제',
      noSeats: '필요 자리를 한 줄씩 추가하세요.',
      part: 'Part',
      station: 'Section',
      skill: '자동 Skill',
      min: 'Min',
    },
    schedule: {
      title: 'Schedule Board',
      subtitle: 'Roster Sheet는 왼쪽에 Part/Station, 위쪽에 시간대를 두는 가로형 스프레드시트다. 조건에 맞지 않는 직원은 드롭다운에서 숨긴다.',
      sheet: 'Roster Sheet',
      confirmed: '확정 근무표',
      member: '직원별',
      part: '파트별',
      csv: 'CSV 내보내기',
      print: 'PDF용 인쇄',
      dayLabel: '요일',
      noRequirementDay: '이 요일에는 Requirements에서 추가된 자리가 없다.',
      noTimeBlocks: '시간 블록 없음',
      statusRequired: 'Status / Required',
      partHeader: 'Part',
      stationHeader: 'Station',
      seatHeader: 'Seat',
      requiredHeader: 'Status / Required',
      recommend: '추천',
      replace: '대체',
      assigned: '정상',
      missing: '미배정',
      unassigned: '미배정',
      invalid: '부적합',
      ok: '적합',
      caution: '주의',
      urgent: '긴급',
      noRequirements: 'Requirements에 시간 블록이 없다.',
      weeklyRoster: 'Weekly Roster',
      printTitle: '월–일 전체 확정 근무표',
      printSubtitle: 'PDF 출력용 로스터다. 요일은 가로축, Phase는 세로축이며 Part별로 한 페이지씩 출력되도록 압축했다.',
      noPartWork: '이 카테고리에 배정할 업무가 없다.',
      phase: 'Phase',
      time: 'Time',
      peak: 'Peak',
      normal: 'Normal',
      schedulePreview: 'Schedule preview',
      rosterHint: '시간을 가로축에 둔 배치표다. 왼쪽 Part/Station 행을 보고, 각 시간대 칸에서 조건에 맞는 직원만 선택한다.',
      confirmedHint: 'PDF 출력용 로스터다. 요일은 가로축, Phase는 세로축이며 Part별로 한 페이지씩 출력되도록 압축했다.',
      rosterHintShort: '시간을 가로축에 둔 배치표다.',
    },
    labor: {
      title: 'Labor Cost',
      subtitle: '스케줄 배정 결과를 기준으로 직원별 평일/토/일 근무시간과 파트별 인건비를 계산한다.',
      budget: '목표 인건비',
      usage: '사용률',
      neededSales: '필요 매출',
      progress: '목표 대비 진행률',
      employee: '직원',
      part: 'Part',
      weekday: '평일',
      saturday: '토',
      sunday: '일',
      total: '합계',
      labor: '예상 인건비',
      max: '최대',
      byEmployee: '직원별',
      byPart: '파트별',
      usageBase: '총 인건비 ÷ 목표 인건비',
      ratioBase: '{ratio}% 인건비율 기준',
    },
    validation: {
      title: 'Validation',
      subtitle: '미배정, Skill/Level 부족, 가능 시간 위반, 중복 배치, 목표 인건비 초과를 검사한다.',
      resultTitle: '검증 결과',
      noIssues: '현재 주요 문제 없음',
      statusHigh: 'high',
      statusMedium: 'medium',
      statusLow: 'low',
    },
    roadmap: {
      title: 'Roadmap',
      subtitle: '지금 구현하지 않는 기능을 앱 내부에 남겨두는 개발 메모다.',
    },
  },
  en: {
    tabs: {
      dashboard: 'Dashboard',
      parts: 'Parts / Stations',
      skills: 'Skills',
      members: 'Members',
      requirements: 'Requirements',
      schedule: 'Schedule Board',
      labor: 'Labor Cost',
      validation: 'Validation',
      settings: 'Settings',
      roadmap: 'Roadmap',
    },
    header: {
      subtitle: 'Shift scheduling and labor cost management based on Parts, Stations, and Level/Step',
    },
    common: {
      save: 'Save',
      exportJson: 'Export JSON',
      importJson: 'Import JSON',
      resetAll: 'Reset All',
      copy: 'Copy',
      add: 'Add',
      delete: 'Delete',
      close: 'Close',
      active: 'Active',
      inactive: 'Inactive',
      selected: 'Selected',
      all: 'All',
      settings: 'Settings',
      language: 'Language',
      korean: 'Korean',
      english: 'English',
      required: 'Required',
      optional: 'Optional',
      noData: 'No data',
      noItems: 'Nothing to show.',
    },
    messages: {
      saved: 'Saved',
      resetConfirm: 'Clear all input data and return to a blank state? Your current data will be deleted.',
      resetDone: 'All input data has been cleared',
      jsonImported: 'JSON import complete',
      invalidJson: 'Could not read the JSON file.',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      partNameRequired: 'Enter a Part name',
      partSelectRequired: 'Select a Part first',
      partAdded: 'Part added',
      partDeleteConfirm: 'Delete this Part? Related employees/stations may remain connected.',
      stationNameRequired: 'Enter a Station name',
      stationSelectRequired: 'Select a Station first',
      stationAdded: 'Station added',
      stationDeleteConfirm: 'Delete this Station?',
      skillNameRequired: 'Enter a Skill name',
      skillAdded: 'Skill added',
      skillDeleteConfirm: 'Delete this Skill? It will also be removed from employees.',
      levelAdded: 'Skill level added',
      employeeNameRequired: 'Enter an employee name',
      employeeAdded: 'Employee added',
      employeeDeleteConfirm: 'Delete this employee? Their schedule assignments will also be removed.',
      requirementAdded: 'Time block added',
      requirementDeleteConfirm: 'Delete this time block? Related schedule assignments will also be removed.',
      stationReqAdded: 'Added one required seat',
      stationReqCloned: 'Cloned one required seat',
      skillSelectRequired: 'Select a Skill',
      levelSelectRequired: 'Select a Level',
      stepSelectRequired: 'Select a Step',
      skillNotFound: 'Could not find the Skill',
      skillSaved: '{skill} Level {level} / Step {step} saved',
      levelExistsConfirm: 'This Skill already has the same Level / Step. Add it anyway?',
      scheduled: 'Assigned',
      languageSaved: 'Language changed',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage language, default display values, ad/feedback links, and save/restore behavior.',
      languageLabel: 'Language switch',
      languageHelp: 'Switch the main app buttons and section titles between Korean and English. Saved data names stay unchanged.',
      laborTitle: 'Labor settings',
      budgetLabel: 'Target labor budget',
      budgetHelp: 'Used as the baseline for the dashboard and labor calculations.',
      ratioLabel: 'Target labor ratio',
      ratioHelp: 'Used when calculating labor cost as a share of sales.',
      supportTitle: 'Ads / Feedback',
      supportSubtitle: 'Keep ad space and contact channels separate from the core scheduler.',
      adTitle: 'Ad space',
      adHelp: 'A reserved slot for AdSense, banners, or sponsor links.',
      adPlaceholder: 'Ad will appear here',
      adNote: 'You can wire real ad code into this space later.',
      feedbackTitle: 'Questions / Feedback',
      feedbackHelp: 'Manage the email and question link people can use to contact you.',
      feedbackEmailLabel: 'Contact email',
      feedbackUrlLabel: 'Question link',
      feedbackEmailHelp: 'Read-only, but easy to copy.',
      feedbackUrlHelp: 'Leave it blank for now, and add a question link later.',
      feedbackOpenEmail: 'Send question',
      feedbackOpenLink: 'Open question link',
      current: 'Current language',
      koreanLabel: 'Korean',
      englishLabel: 'English',
      uiPreview: 'UI preview',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Review this week’s scheduling health, labor cost, and missing station coverage at a glance.',
      budgetEdit: 'Edit target labor budget',
      ratioEdit: 'Edit target labor ratio %',
      assignedHours: 'Total assigned hours',
      totalCost: 'Estimated labor cost',
      ratio: 'Budget usage',
      neededSales: 'Required sales',
      completion: 'Schedule completion',
      highRisk: 'High Risk',
      unassigned: 'Unassigned',
      skillReplacement: 'Skill / replacement issues',
      budgetProgress: 'Target labor progress',
      partLabor: 'Labor by Part',
      topIssues: 'Top issues to check first',
      noIssues: 'No major warnings right now',
      noData: 'No data',
      immediateReview: 'Immediate review needed',
      stationSlotBase: 'Based on station slots',
      skillReplacementHint: 'Skill shortage / no replacement',
      overBudget: 'Exceeded by {amount}.',
      remainingBudget: 'Remaining budget: {amount}',
      currentSchedule: 'Current schedule',
      budgetTarget: 'Target {amount}',
      budgetRatioBase: 'Based on {ratio}% labor ratio',
      slotsAssigned: '{assigned}/{total} slots assigned',
      goalMet: 'Within target',
      goalExceeded: 'Over target',
    },
    parts: {
      title: 'Parts / Stations',
      subtitle: 'A Part is a larger department. A Station is the actual work location. Example: Kitchen → Prep, Hot, Fry, Pass, Dish.',
      partAddTitle: 'Add Part',
      stationAddTitle: 'Add Station',
      partName: 'Part name',
      stationName: 'Station name',
      description: 'Description',
      color: 'Color',
      active: 'Active',
      inactive: 'Inactive',
      partHeader: 'Part',
      stationHeader: 'Station',
      statusHeader: 'Status',
      noParts: 'No Parts yet.',
      noStations: 'No Stations yet.',
      deletePart: 'Delete',
      deleteStation: 'Delete',
    },
    skills: {
      title: 'Skills / Levels',
      subtitle: 'Select a Skill on the left, then manage its Level / Step definitions on the right. Level / Step lives inside the Skill.',
      guideTitle: 'Structure',
      guideText: 'A Station is a work location, a Skill is the ability required there, and Level / Step is the proficiency stage within that Skill. Example: Fry section → Level 1 / Step 4.',
      addSkillTitle: 'Add Skill',
      addStepTitle: 'Add Level / Step',
      noSkillSelected: 'No Skill selected',
      noSkillSelectedText: 'Add or choose a Skill on the left to open the Level / Step panel.',
      noSkillSteps: 'This Skill has no Level / Step yet. Add one above.',
      noSkills: 'No Skills yet.',
      chooseSkill: 'Choose Skill',
      chooseLevel: 'Choose Level',
      chooseStep: 'Choose Step',
      addLevel: 'Add step',
      deleteLevel: 'Delete',
      deleteSkill: 'Delete',
    },
    members: {
      title: 'Members',
      subtitle: 'Manage each employee’s Part, availability, skills, and Level/Step. The Part filter stays synced with Parts added or removed elsewhere.',
      partFilter: 'View Part',
      addEmployeeTitle: 'Add employee',
      name: 'Name',
      part: 'Part',
      role: 'Role',
      rate: 'Rate',
      maxHours: 'Max weekly hours',
      addEmployee: 'Add employee',
      availability: 'Availability',
      skillLevelStep: 'Assign Skill Level / Step',
      skillStepHelp: 'Pick one of the levels defined inside the selected Skill.',
      assignSkill: 'Add / update Skill',
      removeSkill: 'Remove',
      noEmployeesHere: 'No employees in this Part',
      noEmployeesVisible: 'No employees to show for the selected Part.',
      weekHours: 'This week',
      max: 'Max',
      weekday: 'Weekday',
      saturday: 'Sat',
      sunday: 'Sun',
      deactivate: 'Deactivate',
      activate: 'Activate',
    },
    requirements: {
      title: 'Requirements',
      subtitle: 'Add one row per required seat inside each day/time block. If you need two people at the same station, add that station twice.',
      guideTitle: 'How it works',
      guideText: 'Example: if Dinner Peak needs 2 people on Kitchen/Fry, add the Kitchen / Fry seat twice. The Schedule Board will create two lines automatically.',
      daySelect: 'Select day',
      addBlockTitle: 'Add time block',
      day: 'Day',
      start: 'Start',
      end: 'End',
      label: 'Label',
      peak: 'Peak',
      addBlock: 'Add block',
      noBlocks: 'No time blocks yet for this day.',
      requiredSeats: 'Required seats',
      seat: 'Seat',
      seatAdd: 'Add one seat',
      cloneSeat: 'Clone seat',
      deleteBlock: 'Delete block',
      deleteSeat: 'Delete',
      noSeats: 'Add required seats one by one.',
      part: 'Part',
      station: 'Station',
      skill: 'Auto Skill',
      min: 'Min',
    },
    schedule: {
      title: 'Schedule Board',
      subtitle: 'Roster Sheet is a horizontal spreadsheet with Parts/Stations on the left and time blocks across the top. Employees who do not fit are hidden from the dropdown.',
      sheet: 'Roster Sheet',
      confirmed: 'Confirmed roster',
      member: 'By employee',
      part: 'By Part',
      csv: 'Export CSV',
      print: 'Print PDF',
      dayLabel: 'Day',
      noRequirementDay: 'No seats have been added in Requirements for this day.',
      noTimeBlocks: 'No time blocks',
      statusRequired: 'Status / Required',
      partHeader: 'Part',
      stationHeader: 'Station',
      seatHeader: 'Seat',
      requiredHeader: 'Status / Required',
      recommend: 'Recommend',
      replace: 'Replace',
      assigned: 'OK',
      missing: 'Unassigned',
      unassigned: 'Unassigned',
      invalid: 'Not fit',
      ok: 'Fit',
      caution: 'Caution',
      urgent: 'Urgent',
      noRequirements: 'No time blocks in Requirements.',
      weeklyRoster: 'Weekly Roster',
      printTitle: 'Full weekly confirmed roster',
      printSubtitle: 'PDF output roster. Days run across the top, phases down the side, and each Part prints on its own page.',
      noPartWork: 'No work for this category.',
      phase: 'Phase',
      time: 'Time',
      peak: 'Peak',
      normal: 'Normal',
      schedulePreview: 'Schedule preview',
      rosterHint: 'A horizontal work grid with time across the top. Use the left-side Part/Station rows and pick only the employees who fit each slot.',
      confirmedHint: 'PDF output roster with days across the top and phases down the side, compressed to one page per Part.',
      rosterHintShort: 'A horizontal work grid with time across the top.',
    },
    labor: {
      title: 'Labor Cost',
      subtitle: 'Calculate weekday/Sat/Sun hours and labor cost by employee and by Part based on the current schedule.',
      budget: 'Target labor budget',
      usage: 'Usage',
      neededSales: 'Required sales',
      progress: 'Target progress',
      employee: 'Employee',
      part: 'Part',
      weekday: 'Weekday',
      saturday: 'Sat',
      sunday: 'Sun',
      total: 'Total',
      labor: 'Estimated labor cost',
      max: 'Max',
      byEmployee: 'By employee',
      byPart: 'By Part',
      usageBase: 'Total labor ÷ target labor',
      ratioBase: '{ratio}% labor ratio',
    },
    validation: {
      title: 'Validation',
      subtitle: 'Check for unassigned seats, skill/level shortages, availability conflicts, duplicate assignments, and labor budget overruns.',
      resultTitle: 'Validation result',
      noIssues: 'No major issues right now',
      statusHigh: 'high',
      statusMedium: 'medium',
      statusLow: 'low',
    },
    roadmap: {
      title: 'Roadmap',
      subtitle: 'A living note inside the app for features not implemented yet.',
    },
  },
};

function currentLanguage() {
  return state?.settings?.language === 'en' ? 'en' : 'ko';
}

function textFor(lang, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], I18N[lang]);
}

function t(path, vars = {}) {
  const lang = currentLanguage();
  const value = textFor(lang, path) ?? textFor('ko', path) ?? path;
  if (typeof value !== 'string') return path;
  return value.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}

function setLanguage(lang) {
  state.settings.language = lang === 'en' ? 'en' : 'ko';
  saveState(false);
  render();
  toast(t('messages.languageSaved'));
}

function syncDocumentLanguage() {
  document.documentElement.lang = currentLanguage();
  document.title = `SkillShift Planner · ${t('tabs.dashboard')}`;
  const subtitle = document.getElementById('headerSubtitle');
  if (subtitle) subtitle.textContent = t('header.subtitle');
  const importLabel = document.getElementById('importLabel');
  if (importLabel) importLabel.textContent = t('common.importJson');
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) saveBtn.textContent = t('common.save');
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.textContent = t('common.exportJson');
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.textContent = t('common.resetAll');
}

let state = loadState();
let activeTab = 'dashboard';
let selectedSkillId = state.skills[0]?.id || '';
let scheduleView = 'sheet';
let selectedScheduleDay = 'monday';
let selectedRequirementDay = 'monday';
let selectedMemberPart = 'all';
let recommendationContext = null;
let replacementContext = null;

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function defaultAvailability(start = '10:00', end = '22:00', weekdaysOnly = false) {
  return DAYS.reduce((acc, day) => {
    const isWeekend = day.key === 'saturday' || day.key === 'sunday';
    acc[day.key] = {
      available: weekdaysOnly ? !isWeekend : true,
      startTime: start,
      endTime: end,
    };
    return acc;
  }, {});
}

function createDefaultState() {
  const parts = [
    { id: 'part_kitchen', name: '주방', description: '조리와 마감이 이루어지는 파트', color: '#ef4444', sortOrder: 1, active: true },
    { id: 'part_hall', name: '홀', description: '고객 응대와 서빙이 이루어지는 파트', color: '#3b82f6', sortOrder: 2, active: true },
  ];

  const stations = [
    { id: 'st_prep', partId: 'part_kitchen', name: '준비', description: '재료 준비 / 미장', requiredSkillIds: ['sk_prep'], sortOrder: 1, active: true },
    { id: 'st_hot', partId: 'part_kitchen', name: '화구', description: '메인 조리', requiredSkillIds: ['sk_hot'], sortOrder: 2, active: true },
    { id: 'st_fry', partId: 'part_kitchen', name: '프라이', description: '튀김 / 소분', requiredSkillIds: ['sk_fry'], sortOrder: 3, active: true },
    { id: 'st_pass', partId: 'part_kitchen', name: '패스', description: '플레이트 / 출고', requiredSkillIds: ['sk_pass'], sortOrder: 4, active: true },
    { id: 'st_dish', partId: 'part_kitchen', name: '세척', description: '설거지 / 정리', requiredSkillIds: ['sk_dish'], sortOrder: 5, active: true },
    { id: 'st_floor', partId: 'part_hall', name: '플로어', description: '홀 서비스', requiredSkillIds: ['sk_floor'], sortOrder: 1, active: true },
    { id: 'st_cashier', partId: 'part_hall', name: '캐셔', description: '주문 / 계산', requiredSkillIds: ['sk_cashier'], sortOrder: 2, active: true },
    { id: 'st_runner', partId: 'part_hall', name: '러너', description: '서빙 보조', requiredSkillIds: ['sk_runner'], sortOrder: 3, active: true },
  ];

  const skills = [
    { id: 'sk_prep', name: '주방 준비', partId: 'part_kitchen', stationId: 'st_prep', category: 'Kitchen', description: '재료 준비와 미장 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_hot', name: '주방 화구', partId: 'part_kitchen', stationId: 'st_hot', category: 'Kitchen', description: '메인 화구 조리 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_fry', name: '주방 프라이', partId: 'part_kitchen', stationId: 'st_fry', category: 'Kitchen', description: '프라이와 튀김 작업 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_pass', name: '주방 패스', partId: 'part_kitchen', stationId: 'st_pass', category: 'Kitchen', description: '패스와 플레이트 출고 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_dish', name: '주방 세척', partId: 'part_kitchen', stationId: 'st_dish', category: 'Kitchen', description: '설거지와 마감 정리 가능', isCritical: false, usesLevelStep: true, active: true },
    { id: 'sk_floor', name: '홀 플로어', partId: 'part_hall', stationId: 'st_floor', category: 'Hall', description: '홀 서빙과 테이블 정리 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_cashier', name: '홀 캐셔', partId: 'part_hall', stationId: 'st_cashier', category: 'Hall', description: '주문 접수와 계산 가능', isCritical: true, usesLevelStep: true, active: true },
    { id: 'sk_runner', name: '홀 러너', partId: 'part_hall', stationId: 'st_runner', category: 'Hall', description: '서빙 보조와 전달 가능', isCritical: false, usesLevelStep: true, active: true },
  ];

  const levelTemplates = [];
  skills.forEach((skill) => {
    const base = [
      [1, 'Level 1', 1, 'Step 1', '기본 개념을 배우는 단계', '기본 보조 업무', '단독 업무와 피크타임 대응', false, false, true],
      [1, 'Level 1', 2, 'Step 2', '반복 업무와 기본 흐름을 일부 수행할 수 있는 단계', '간단한 반복 업무', '조리/응대 상태 최종 판단', false, false, true],
      [1, 'Level 1', 3, 'Step 3', '대부분의 흐름을 알고 몇 가지 확인을 통해 업무 가능', '일반 시간대 보조 및 일부 단독 업무', '피크타임 단독 업무', false, false, true],
      [1, 'Level 1', 4, 'Step 4', 'Level 2 직전 단계. 약간의 어시스트를 제외하면 대부분 수행 가능', '일반 시간대 주요 업무', '복잡한 피크타임 판단', false, false, false],
      [2, 'Level 2', 1, 'Step 1', '일반 시간대 단독 업무가 가능한 단계', '일반 운영', '고강도 피크타임 전체 통제', true, false, false],
      [2, 'Level 2', 2, 'Step 2', '일반 업무와 일부 피크타임 대응이 가능한 단계', '일반 운영과 일부 피크 대응', '리더 역할', true, true, false],
      [3, 'Level 3', 1, 'Step 1', '피크타임 핵심 업무가 가능한 단계', '피크타임 핵심 업무', '신입 교육과 전체 운영 판단', true, true, false],
      [4, 'Level 4', 1, 'Step 1', '리더와 교육 담당이 가능한 단계', '리더/트레이닝/문제 해결', '상위 관리 업무', true, true, false],
    ];
    base.forEach(([levelNumber, levelName, stepNumber, stepName, description, canDo, cannotDoYet, canWorkAlone, canWorkPeakTime, needsSupervisor], index) => {
      levelTemplates.push({
        id: `lvl_${skill.id}_${levelNumber}_${stepNumber}`,
        skillId: skill.id,
        levelNumber,
        levelName,
        stepNumber,
        stepName,
        description,
        canDo,
        cannotDoYet,
        canWorkAlone,
        canWorkPeakTime,
        needsSupervisor,
        allowedStations: [skill.stationId].filter(Boolean),
        nextPromotionCriteria: '운영자가 직접 승급 조건을 작성하세요.',
        sortOrder: index + 1,
      });
    });
  });

  const employees = [
    {
      id: 'emp_minjun', name: '민준', partId: 'part_kitchen', role: '주방 메인', employmentType: 'Full-time', baseRate: 31,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 40, preferredWeeklyHours: 38,
      availability: defaultAvailability('09:00', '22:00'), active: true, notes: '', assignedSkills: {
        sk_prep: { level: 2, step: 1, note: '' }, sk_hot: { level: 3, step: 1, note: '' }, sk_fry: { level: 2, step: 2, note: '' }, sk_pass: { level: 2, step: 1, note: '' }
      }
    },
    {
      id: 'emp_yuri', name: '유리', partId: 'part_kitchen', role: '주방 프렙', employmentType: 'Part-time', baseRate: 27,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 30, preferredWeeklyHours: 24,
      availability: defaultAvailability('09:00', '18:00'), active: true, notes: '', assignedSkills: {
        sk_prep: { level: 3, step: 1, note: '' }, sk_dish: { level: 3, step: 1, note: '' }, sk_hot: { level: 1, step: 4, note: '' }
      }
    },
    {
      id: 'emp_joon', name: '준', partId: 'part_kitchen', role: '주방 라인', employmentType: 'Casual', baseRate: 29,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 35, preferredWeeklyHours: 30,
      availability: defaultAvailability('10:00', '22:00'), active: true, notes: '', assignedSkills: {
        sk_hot: { level: 2, step: 2, note: '' }, sk_fry: { level: 3, step: 1, note: '' }, sk_pass: { level: 2, step: 2, note: '' }
      }
    },
    {
      id: 'emp_soo', name: '수', partId: 'part_kitchen', role: '주방 디시', employmentType: 'Part-time', baseRate: 26,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 28, preferredWeeklyHours: 22,
      availability: defaultAvailability('11:00', '22:00'), active: true, notes: '', assignedSkills: {
        sk_dish: { level: 3, step: 1, note: '' }, sk_prep: { level: 2, step: 1, note: '' }, sk_fry: { level: 1, step: 4, note: '' }
      }
    },
    {
      id: 'emp_haeun', name: '하은', partId: 'part_hall', role: '홀 플로어', employmentType: 'Casual', baseRate: 27,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 35, preferredWeeklyHours: 28,
      availability: defaultAvailability('10:00', '22:30'), active: true, notes: '', assignedSkills: {
        sk_floor: { level: 3, step: 1, note: '' }, sk_runner: { level: 2, step: 2, note: '' }, sk_cashier: { level: 1, step: 4, note: '' }
      }
    },
    {
      id: 'emp_jiho', name: '지호', partId: 'part_hall', role: '홀 캐셔', employmentType: 'Full-time', baseRate: 28,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 40, preferredWeeklyHours: 38,
      availability: defaultAvailability('10:00', '23:00'), active: true, notes: '', assignedSkills: {
        sk_cashier: { level: 3, step: 1, note: '' }, sk_floor: { level: 2, step: 2, note: '' }, sk_runner: { level: 2, step: 1, note: '' }
      }
    },
    {
      id: 'emp_sora', name: '소라', partId: 'part_hall', role: '홀 러너', employmentType: 'Part-time', baseRate: 26,
      saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: 32, preferredWeeklyHours: 26,
      availability: defaultAvailability('11:00', '22:30'), active: true, notes: '', assignedSkills: {
        sk_runner: { level: 3, step: 1, note: '' }, sk_floor: { level: 2, step: 2, note: '' }, sk_cashier: { level: 1, step: 4, note: '' }
      }
    },
  ];

  const requirements = [];
  DAYS.forEach((day) => {
    const slots = [
      { label: 'Opening', startTime: '09:00', endTime: '10:30', isPeak: false, reqs: [['part_kitchen', 'st_prep', 'sk_prep', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 1, 3]] },
      { label: 'Lunch Prep', startTime: '10:30', endTime: '11:30', isPeak: false, reqs: [['part_kitchen', 'st_prep', 'sk_prep', 1, 1, 3], ['part_kitchen', 'st_hot', 'sk_hot', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3]] },
      { label: 'Lunch Peak', startTime: '11:30', endTime: '14:30', isPeak: true, reqs: [['part_kitchen', 'st_hot', 'sk_hot', 1, 2, 1], ['part_kitchen', 'st_fry', 'sk_fry', 1, 2, 1], ['part_kitchen', 'st_pass', 'sk_pass', 1, 2, 1], ['part_hall', 'st_floor', 'sk_floor', 2, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 2, 1], ['part_hall', 'st_runner', 'sk_runner', 1, 1, 3]] },
      { label: 'Afternoon', startTime: '14:30', endTime: '17:00', isPeak: false, reqs: [['part_kitchen', 'st_prep', 'sk_prep', 1, 1, 3], ['part_kitchen', 'st_dish', 'sk_dish', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3]] },
      { label: 'Dinner Peak', startTime: '17:00', endTime: '20:30', isPeak: true, reqs: [['part_kitchen', 'st_hot', 'sk_hot', 1, 2, 1], ['part_kitchen', 'st_fry', 'sk_fry', 1, 2, 1], ['part_kitchen', 'st_pass', 'sk_pass', 1, 2, 1], ['part_kitchen', 'st_dish', 'sk_dish', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 2, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 2, 1], ['part_hall', 'st_runner', 'sk_runner', 1, 1, 3]] },
      { label: 'Closing', startTime: '20:30', endTime: '22:00', isPeak: false, reqs: [['part_kitchen', 'st_dish', 'sk_dish', 1, 1, 3], ['part_hall', 'st_floor', 'sk_floor', 1, 1, 3], ['part_hall', 'st_cashier', 'sk_cashier', 1, 1, 3]] },
    ];
    slots.forEach((slot, index) => {
      requirements.push({
        id: `req_${day.key}_${index}`,
        dayOfWeek: day.key,
        startTime: slot.startTime,
        endTime: slot.endTime,
        label: slot.label,
        minTotalStaff: slot.reqs.reduce((sum, req) => sum + req[3], 0),
        recommendedTotalStaff: slot.reqs.reduce((sum, req) => sum + req[3], 0),
        isPeak: slot.isPeak,
        needsHandover: false,
        handoverMinutes: 0,
        notes: '',
        stationRequirements: slot.reqs.flatMap(([partId, stationId, requiredSkillId, requiredCount, minLevel, minStep], idx) =>
          Array.from({ length: requiredCount }, (_, seatIdx) => ({
            id: `sreq_${day.key}_${index}_${idx}_${seatIdx}`,
            partId,
            stationId,
            requiredCount: 1,
            requiredSkillId,
            minLevel,
            minStep,
            needsLeader: stationId === 'st_leader',
            canUseLowerStepAsEmergency: true,
          }))
        ),
      });
    });
  });

  return {
    appVersion: APP_STATE_VERSION,
    settings: {
      language: 'ko',
      laborBudget: 4000,
      targetLaborRatio: 28,
      currency: '$',
      weekLabel: '주방/홀 기본 스케줄',
      feedbackEmail: 'kitchenworklog@gmail.com',
      feedbackUrl: '',
    },
    parts,
    stations,
    skills,
    levelTemplates,
    employees,
    requirements,
    schedule: {},
  };
}

function createBlankState(settings = createDefaultState().settings) {
  return {
    appVersion: APP_STATE_VERSION,
    settings: {
      ...settings,
      feedbackEmail: 'kitchenworklog@gmail.com',
      feedbackUrl: '',
    },
    parts: [],
    stations: [],
    skills: [],
    levelTemplates: [],
    employees: [],
    requirements: [],
    schedule: {},
  };
}

function mergeState(parsed = {}) {
  const defaults = createDefaultState();
  const settings = {
    ...defaults.settings,
    ...(parsed.settings || {}),
  };
  settings.feedbackEmail = 'kitchenworklog@gmail.com';
  settings.feedbackUrl = '';
  return {
    ...defaults,
    ...parsed,
    appVersion: Math.max(Number(parsed.appVersion || 0), defaults.appVersion),
    settings,
  };
}

function clearStoredState() {
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORE_PREFIX)) localStorage.removeItem(key);
  }
}

function makeFreshState() {
  const fresh = createDefaultState();
  clearStoredState();
  localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
  return fresh;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return makeFreshState();
    const parsed = JSON.parse(raw);
    if (Number(parsed?.appVersion || 0) < APP_STATE_VERSION) return makeFreshState();
    return mergeState(parsed);
  } catch (err) {
    console.error(err);
    return makeFreshState();
  }
}

function saveState(show = true) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (show) toast(t('messages.saved'));
}

function resetState() {
  if (!confirm(t('messages.resetConfirm'))) return;
  const preservedSettings = { ...state.settings };
  clearStoredState();
  state = createBlankState(preservedSettings);
  selectedSkillId = state.skills[0]?.id || '';
  selectedMemberPart = 'all';
  selectedScheduleDay = 'monday';
  selectedRequirementDay = 'monday';
  scheduleView = 'sheet';
  recommendationContext = null;
  replacementContext = null;
  saveState(false);
  render();
  toast(t('messages.resetDone'));
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 1600);
}

function byId(list, id) { return list.find((item) => item.id === id); }
function partName(id) { return byId(state.parts, id)?.name || 'Unknown Part'; }
function stationName(id) { return byId(state.stations, id)?.name || 'Unknown Station'; }
function skillName(id) { return byId(state.skills, id)?.name || 'Unknown Skill'; }
function employeeName(id) { return byId(state.employees, id)?.name || 'Unassigned'; }
function dayLabel(key) { return DAYS.find((d) => d.key === key)?.[currentLanguage()]?.label || key; }
function dayShort(key) { return DAYS.find((d) => d.key === key)?.[currentLanguage()]?.short || key; }
function money(value) { return `${state.settings.currency}${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`; }
function num(value, fallback = 0) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
function normalizeExternalUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
  return `https://${raw}`;
}
function mailtoLink(email) {
  const raw = String(email ?? '').trim();
  return raw ? `mailto:${raw}` : '';
}
async function copyToClipboard(text) {
  const value = String(text ?? '').trim();
  if (!value) {
    toast(t('messages.copyFailed'));
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!ok) throw new Error('copy failed');
    }
    toast(t('messages.copied'));
  } catch (err) {
    console.error(err);
    toast(t('messages.copyFailed'));
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toMinutes(time) {
  if (!time || !time.includes(':')) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function durationHours(start, end) {
  return Math.max(0, (toMinutes(end) - toMinutes(start)) / 60);
}

function getRate(employee, dayKey) {
  const base = num(employee.baseRate);
  if (dayKey === 'saturday') return base * num(employee.saturdayMultiplier, 1);
  if (dayKey === 'sunday') return base * num(employee.sundayMultiplier, 1);
  return base;
}

function assignmentKey(reqId, stationReqId, slotIndex) {
  return `${reqId}__${stationReqId}__${slotIndex}`;
}

function parseAssignmentKey(key) {
  const [reqId, stationReqId, slotIndex] = key.split('__');
  return { reqId, stationReqId, slotIndex: Number(slotIndex) };
}

function getAssignments() {
  return Object.entries(state.schedule)
    .filter(([, employeeId]) => employeeId)
    .map(([key, employeeId]) => ({ key, employeeId, ...parseAssignmentKey(key) }));
}

function getReqById(reqId) { return state.requirements.find((req) => req.id === reqId); }
function getStationReq(reqId, stationReqId) { return getReqById(reqId)?.stationRequirements.find((s) => s.id === stationReqId); }
function getRequiredSkillId(stationReq) {
  if (stationReq?.requiredSkillId) return stationReq.requiredSkillId;
  const station = byId(state.stations, stationReq?.stationId);
  if (station?.requiredSkillIds?.length) return station.requiredSkillIds[0];
  return state.skills.find((skill) => skill.stationId === stationReq?.stationId)?.id || '';
}
function requiredSkillName(stationReq) {
  const skillId = getRequiredSkillId(stationReq);
  return skillId ? skillName(skillId) : 'Station linked skill 없음';
}
function getRequirementSeatRows() {
  const dayOrder = Object.fromEntries(DAYS.map((d, i) => [d.key, i]));
  const rows = [];
  state.requirements.forEach((req) => {
    (req.stationRequirements || []).forEach((sreq) => {
      const count = Math.max(1, Number(sreq.requiredCount || 1));
      for (let slotIndex = 0; slotIndex < count; slotIndex += 1) {
        rows.push({ req, sreq, slotIndex, key: assignmentKey(req.id, sreq.id, slotIndex) });
      }
    });
  });
  return rows.sort((a, b) =>
    (dayOrder[a.req.dayOfWeek] - dayOrder[b.req.dayOfWeek]) ||
    (toMinutes(a.req.startTime) - toMinutes(b.req.startTime)) ||
    partName(a.sreq.partId).localeCompare(partName(b.sreq.partId)) ||
    stationName(a.sreq.stationId).localeCompare(stationName(b.sreq.stationId)) ||
    a.slotIndex - b.slotIndex
  );
}

function employeeWeeklyHours(employeeId) {
  return getAssignments().reduce((total, assignment) => {
    if (assignment.employeeId !== employeeId) return total;
    const req = getReqById(assignment.reqId);
    if (!req) return total;
    return total + durationHours(req.startTime, req.endTime);
  }, 0);
}

function employeeWeeklyCost(employeeId) {
  const employee = byId(state.employees, employeeId);
  if (!employee) return 0;
  return getAssignments().reduce((total, assignment) => {
    if (assignment.employeeId !== employeeId) return total;
    const req = getReqById(assignment.reqId);
    if (!req) return total;
    return total + durationHours(req.startTime, req.endTime) * getRate(employee, req.dayOfWeek);
  }, 0);
}

function employeeWorkBreakdown(employeeId) {
  const employee = byId(state.employees, employeeId);
  const empty = {
    weekdayHours: 0,
    saturdayHours: 0,
    sundayHours: 0,
    weekdayCost: 0,
    saturdayCost: 0,
    sundayCost: 0,
    totalHours: 0,
    totalCost: 0,
  };
  if (!employee) return empty;
  return getAssignments().reduce((acc, assignment) => {
    if (assignment.employeeId !== employeeId) return acc;
    const req = getReqById(assignment.reqId);
    if (!req) return acc;
    const hours = durationHours(req.startTime, req.endTime);
    const cost = hours * getRate(employee, req.dayOfWeek);
    if (req.dayOfWeek === 'saturday') {
      acc.saturdayHours += hours;
      acc.saturdayCost += cost;
    } else if (req.dayOfWeek === 'sunday') {
      acc.sundayHours += hours;
      acc.sundayCost += cost;
    } else {
      acc.weekdayHours += hours;
      acc.weekdayCost += cost;
    }
    acc.totalHours += hours;
    acc.totalCost += cost;
    return acc;
  }, { ...empty });
}

function totalLaborCost() {
  return state.employees.reduce((total, emp) => total + employeeWeeklyCost(emp.id), 0);
}

function isEmployeeAvailable(employee, req) {
  const av = employee.availability?.[req.dayOfWeek];
  if (!av || !av.available) return { status: 'bad', reason: `${dayLabel(req.dayOfWeek)} 근무 불가능` };
  const reqStart = toMinutes(req.startTime);
  const reqEnd = toMinutes(req.endTime);
  const avStart = toMinutes(av.startTime);
  const avEnd = toMinutes(av.endTime);
  if (avStart <= reqStart && avEnd >= reqEnd) return { status: 'ok', reason: `${av.startTime}–${av.endTime} 가능` };
  if (avEnd > reqStart && avStart < reqEnd) return { status: 'partial', reason: `부분 가능: ${av.startTime}–${av.endTime}` };
  return { status: 'bad', reason: `시간 불가: ${av.startTime}–${av.endTime}` };
}

function hasOverlappingAssignment(employeeId, req, ignoreKey = '') {
  return getAssignments().some((assignment) => {
    if (assignment.key === ignoreKey) return false;
    if (assignment.employeeId !== employeeId) return false;
    const other = getReqById(assignment.reqId);
    if (!other || other.dayOfWeek !== req.dayOfWeek) return false;
    return toMinutes(other.startTime) < toMinutes(req.endTime) && toMinutes(other.endTime) > toMinutes(req.startTime);
  });
}

function highestStepForSkillLevel(skillId, levelNumber) {
  const steps = state.levelTemplates
    .filter((tpl) => tpl.skillId === skillId && Number(tpl.levelNumber) === Number(levelNumber))
    .map((tpl) => Number(tpl.stepNumber));
  return steps.length ? Math.max(...steps) : 4;
}

function compareLevelStep(employee, stationReq) {
  const requiredSkillId = getRequiredSkillId(stationReq);
  const assigned = employee.assignedSkills?.[requiredSkillId];
  if (!assigned) return { status: 'bad', reason: '필수 Skill 없음', score: -100 };
  const level = num(assigned.level);
  const step = num(assigned.step);
  const minLevel = num(stationReq.minLevel);
  const minStep = num(stationReq.minStep);

  if (level > minLevel || (level === minLevel && step >= minStep)) {
    return { status: 'ok', reason: `Level ${level} - Step ${step}: 요구 조건 충족`, score: 50 + (level - minLevel) * 10 + (step - minStep) };
  }
  if (level === minLevel && step < minStep) {
    return { status: 'partial', reason: `Level은 맞지만 Step 부족: 현재 Step ${step}, 필요 Step ${minStep}`, score: 20 - (minStep - step) };
  }
  if (stationReq.canUseLowerStepAsEmergency && level === minLevel - 1) {
    const maxStep = highestStepForSkillLevel(requiredSkillId, level);
    if (step >= Math.max(3, maxStep - 1)) {
      return { status: 'emergency', reason: `한 Level 아래지만 높은 Step: Level ${level} - Step ${step}`, score: 8 };
    }
  }
  return { status: 'bad', reason: `숙련도 부족: Level ${level} - Step ${step}, 필요 Level ${minLevel} - Step ${minStep}`, score: -40 };
}

function getCandidateStatus(employee, req, stationReq, ignoreKey = '') {
  if (!employee.active) return { category: 'bad', score: -999, reasons: ['비활성 직원'] };
  const reasons = [];
  let score = 0;

  const availability = isEmployeeAvailable(employee, req);
  reasons.push(availability.reason);
  if (availability.status === 'ok') score += 40;
  if (availability.status === 'partial') score += 5;
  if (availability.status === 'bad') score -= 120;

  const skill = compareLevelStep(employee, stationReq);
  reasons.push(skill.reason);
  score += skill.score;

  if (req.isPeak) {
    const template = getEmployeeLevelTemplate(employee, getRequiredSkillId(stationReq));
    if (template?.canWorkPeakTime) {
      score += 8;
      reasons.push('피크타임 가능');
    } else if (skill.status === 'ok') {
      reasons.push('피크타임 가능 여부 확인 필요');
      score -= 5;
    }
  }

  if (hasOverlappingAssignment(employee.id, req, ignoreKey)) {
    score -= 90;
    reasons.push('같은 시간대 다른 배정 있음');
  }

  const projectedHours = employeeWeeklyHours(employee.id) + durationHours(req.startTime, req.endTime);
  if (projectedHours > num(employee.maxWeeklyHours, 999)) {
    score -= 60;
    reasons.push(`최대 주간시간 초과 예상: ${projectedHours.toFixed(1)}h / ${employee.maxWeeklyHours}h`);
  } else {
    score += 5;
    reasons.push(`주간 예상 ${projectedHours.toFixed(1)}h / ${employee.maxWeeklyHours}h`);
  }

  const addedCost = durationHours(req.startTime, req.endTime) * getRate(employee, req.dayOfWeek);
  reasons.push(`추가 인건비 ${money(addedCost)}`);

  let category = 'bad';
  if (availability.status === 'ok' && skill.status === 'ok' && !hasOverlappingAssignment(employee.id, req, ignoreKey) && projectedHours <= num(employee.maxWeeklyHours, 999)) category = 'fit';
  else if (availability.status !== 'bad' && (skill.status === 'partial' || skill.status === 'ok') && score > 0) category = 'partial';
  else if (availability.status !== 'bad' && skill.status === 'emergency' && score > -20) category = 'emergency';

  return { category, score, reasons, addedCost, projectedHours, availability, skill };
}

function getEmployeeLevelTemplate(employee, skillId) {
  const assigned = employee.assignedSkills?.[skillId];
  if (!assigned) return null;
  return state.levelTemplates.find((tpl) =>
    tpl.skillId === skillId &&
    Number(tpl.levelNumber) === Number(assigned.level) &&
    Number(tpl.stepNumber) === Number(assigned.step)
  );
}

function getRecommendations(req, stationReq, excludeEmployeeId = '', ignoreKey = '') {
  return state.employees
    .filter((emp) => emp.id !== excludeEmployeeId)
    .map((emp) => ({ employee: emp, ...getCandidateStatus(emp, req, stationReq, ignoreKey) }))
    .sort((a, b) => b.score - a.score);
}

function calculateValidation() {
  const issues = [];

  state.requirements.forEach((req) => {
    req.stationRequirements.forEach((sreq) => {
      for (let i = 0; i < Number(sreq.requiredCount); i += 1) {
        const key = assignmentKey(req.id, sreq.id, i);
        const employeeId = state.schedule[key];
        if (!employeeId) {
          issues.push({ severity: 'high', type: '미배정', req, sreq, message: `${dayLabel(req.dayOfWeek)} ${req.startTime}–${req.endTime} / ${partName(sreq.partId)} / ${stationName(sreq.stationId)} 미배정` });
          continue;
        }
        const employee = byId(state.employees, employeeId);
        if (!employee) {
          issues.push({ severity: 'high', type: '직원 없음', req, sreq, message: `삭제된 직원이 배정되어 있습니다.` });
          continue;
        }
        const availability = isEmployeeAvailable(employee, req);
        if (availability.status !== 'ok') {
          issues.push({ severity: availability.status === 'partial' ? 'medium' : 'high', type: '가능 시간 위반', req, sreq, employee, message: `${employee.name}: ${availability.reason}` });
        }
        const skill = compareLevelStep(employee, sreq);
        if (skill.status === 'bad') {
          issues.push({ severity: 'high', type: 'Skill / Level 부족', req, sreq, employee, message: `${employee.name}: ${skill.reason}` });
        } else if (skill.status !== 'ok') {
          issues.push({ severity: 'medium', type: 'Skill / Level 주의', req, sreq, employee, message: `${employee.name}: ${skill.reason}` });
        }
        const replacements = getRecommendations(req, sreq, employee.id, key).filter((r) => ['fit', 'partial', 'emergency'].includes(r.category));
        if (!replacements.length) {
          issues.push({ severity: 'medium', type: '대체근무자 없음', req, sreq, employee, message: `${employee.name} 결근 시 대체 가능자가 없습니다.` });
        }
      }
    });

    const inSlot = getAssignments().filter((a) => a.reqId === req.id);
    const duplicates = inSlot.reduce((acc, a) => {
      acc[a.employeeId] = (acc[a.employeeId] || 0) + 1;
      return acc;
    }, {});
    Object.entries(duplicates).forEach(([employeeId, count]) => {
      if (count > 1) {
        issues.push({ severity: 'high', type: '중복 배치', req, message: `${employeeName(employeeId)}가 같은 시간 블록에 ${count}번 배정되었습니다.` });
      }
    });
  });

  state.employees.forEach((emp) => {
    const hours = employeeWeeklyHours(emp.id);
    if (hours > num(emp.maxWeeklyHours, 999)) {
      issues.push({ severity: 'high', type: '주간 최대시간 초과', employee: emp, message: `${emp.name}: ${hours.toFixed(1)}h / 최대 ${emp.maxWeeklyHours}h` });
    }
  });

  const totalCost = totalLaborCost();
  if (state.settings.laborBudget && totalCost > state.settings.laborBudget) {
    issues.push({ severity: 'high', type: '목표 인건비 초과', message: `현재 인건비 ${money(totalCost)} / 목표 ${money(state.settings.laborBudget)}` });
  }

  return issues;
}

function render() {
  syncDocumentLanguage();
  renderTabs();
  renderDashboard();
  renderParts();
  renderSkills();
  renderMembers();
  renderRequirements();
  renderSchedule();
  renderLabor();
  renderValidation();
  renderSettings();
  renderRoadmap();
}

function renderTabs() {
  const tabs = document.getElementById('tabs');
  tabs.innerHTML = TABS.map((tab) => `<button class="tab-btn ${activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">${t(tab.labelKey)}</button>`).join('');
  document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.id === activeTab));
}

function metricCard(label, value, sub = '', status = '') {
  return `<div class="card metric ${status}"><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div>`;
}

function renderDashboard() {
  const el = document.getElementById('dashboard');
  const totalHours = state.employees.reduce((sum, emp) => sum + employeeWeeklyHours(emp.id), 0);
  const cost = totalLaborCost();
  const budget = num(state.settings.laborBudget);
  const ratio = budget ? (cost / budget) * 100 : 0;
  const targetRatio = num(state.settings.targetLaborRatio) / 100;
  const neededSales = targetRatio ? cost / targetRatio : 0;
  const issues = calculateValidation();
  const highIssues = issues.filter((i) => i.severity === 'high').length;
  const missing = issues.filter((i) => i.type === '미배정').length;
  const skillIssues = issues.filter((i) => i.type.includes('Skill')).length;
  const replacementIssues = issues.filter((i) => i.type === '대체근무자 없음').length;
  const budgetStatus = ratio > 100 ? 'danger' : ratio >= 90 ? 'warn' : 'ok';
  const assignedSlots = getAssignments().length;
  const totalSlots = getRequirementSeatRows().length;
  const completion = totalSlots ? (assignedSlots / totalSlots) * 100 : 0;

  const partCosts = state.parts.map((part) => {
    const empIds = state.employees.filter((emp) => emp.partId === part.id).map((emp) => emp.id);
    const partCost = empIds.reduce((sum, id) => sum + employeeWeeklyCost(id), 0);
    return `<span class="badge info">${escapeHtml(part.name)} ${money(partCost)}</span>`;
  }).join('');

  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('tabs.dashboard')}</h2>
        <p>${t('dashboard.subtitle')}</p>
      </div>
      <div class="inline-actions">
        <label class="small-text">${t('dashboard.budgetEdit')} <input type="number" value="${state.settings.laborBudget}" data-setting="laborBudget" /></label>
        <label class="small-text">${t('dashboard.ratioEdit')} <input type="number" value="${state.settings.targetLaborRatio}" data-setting="targetLaborRatio" /></label>
      </div>
    </div>
    <div class="grid four">
      ${metricCard(t('dashboard.assignedHours'), `${totalHours.toFixed(1)}h`, t('dashboard.currentSchedule'))}
      ${metricCard(t('dashboard.totalCost'), money(cost), t('dashboard.budgetTarget', { amount: money(budget) }), budgetStatus)}
      ${metricCard(t('dashboard.ratio'), `${ratio.toFixed(1)}%`, ratio > 100 ? t('dashboard.goalExceeded') : t('dashboard.goalMet'), budgetStatus)}
      ${metricCard(t('dashboard.neededSales'), money(neededSales), t('dashboard.budgetRatioBase', { ratio: state.settings.targetLaborRatio }))}
      ${metricCard(t('dashboard.completion'), `${completion.toFixed(1)}%`, t('dashboard.slotsAssigned', { assigned: assignedSlots, total: totalSlots }))}
      ${metricCard(t('dashboard.highRisk'), highIssues, t('dashboard.immediateReview'), highIssues ? 'danger' : 'ok')}
      ${metricCard(t('dashboard.unassigned'), missing, t('dashboard.stationSlotBase'), missing ? 'warn' : 'ok')}
      ${metricCard(t('dashboard.skillReplacement'), `${skillIssues}/${replacementIssues}`, t('dashboard.skillReplacementHint'))}
    </div>
    <div class="card" style="margin-top:14px;">
      <h3>${t('dashboard.budgetProgress')}</h3>
      <div class="progress ${budgetStatus}"><div style="width:${Math.min(ratio, 120)}%"></div></div>
      <p class="small-text">${ratio > 100 ? t('dashboard.overBudget', { amount: money(cost - budget) }) : t('dashboard.remainingBudget', { amount: money(budget - cost) })}</p>
    </div>
    <div class="grid two" style="margin-top:14px;">
      <div class="card"><h3>${t('dashboard.partLabor')}</h3>${partCosts || `<p class="muted">${t('common.noData')}</p>`}</div>
      <div class="card"><h3>${t('dashboard.topIssues')}</h3>${issues.slice(0, 6).map(issueBadge).join('') || `<span class="badge ok">${t('dashboard.noIssues')}</span>`}</div>
    </div>
  `;
}

function issueBadge(issue) {
  const cls = issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warn' : 'info';
  return `<span class="badge ${cls}">${escapeHtml(issue.type)} · ${escapeHtml(issue.message)}</span>`;
}

function renderParts() {
  const el = document.getElementById('parts');
  el.innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.parts')}</h2><p>${t('parts.subtitle')}</p></div></div>
    <div class="grid two">
      <div class="card">
        <h3>${t('parts.partAddTitle')}</h3>
        <div class="form-row compact">
          <label>${t('parts.partName')}<input id="newPartName" placeholder="예: Kitchen" /></label>
          <label>${t('parts.description')}<input id="newPartDesc" placeholder="예: 주방 파트" /></label>
          <label>${t('parts.color')}<input id="newPartColor" type="color" value="#2563eb" /></label>
          <button class="btn" data-action="add-part">${t('common.add')}</button>
        </div>
        <div class="table-wrap"><table><thead><tr><th>${t('parts.partHeader')}</th><th>${t('parts.description')}</th><th>${t('parts.statusHeader')}</th><th></th></tr></thead><tbody>
          ${state.parts.sort((a,b)=>a.sortOrder-b.sortOrder).map((part) => `
            <tr>
              <td><span class="badge dark" style="background:${part.color}">${escapeHtml(part.name)}</span></td>
              <td>${escapeHtml(part.description)}</td>
              <td>${part.active ? `<span class="badge ok">${t('common.active')}</span>` : `<span class="badge">${t('common.inactive')}</span>`}</td>
              <td><button class="btn small danger" data-action="delete-part" data-id="${part.id}">${t('common.delete')}</button></td>
            </tr>`).join('')}
        </tbody></table></div>
      </div>
      <div class="card">
        <h3>${t('parts.stationAddTitle')}</h3>
        <div class="form-row compact">
          <label>${t('parts.partHeader')}<select id="newStationPart">${partOptions()}</select></label>
          <label>${t('parts.stationName')}<input id="newStationName" placeholder="예: Hot" /></label>
          <label>${t('parts.description')}<input id="newStationDesc" placeholder="예: 핫 섹션" /></label>
          <button class="btn" data-action="add-station">${t('common.add')}</button>
        </div>
        <div class="table-wrap"><table><thead><tr><th>${t('parts.partHeader')}</th><th>${t('parts.stationHeader')}</th><th>${t('parts.description')}</th><th></th></tr></thead><tbody>
          ${state.stations.sort(sortStations).map((station) => `
            <tr>
              <td>${escapeHtml(partName(station.partId))}</td>
              <td><span class="badge info">${escapeHtml(station.name)}</span></td>
              <td>${escapeHtml(station.description)}</td>
              <td><button class="btn small danger" data-action="delete-station" data-id="${station.id}">${t('common.delete')}</button></td>
            </tr>`).join('')}
        </tbody></table></div>
      </div>
    </div>
  `;
}

function partOptions(selected = '') {
  return state.parts.map((part) => `<option value="${part.id}" ${selected === part.id ? 'selected' : ''}>${escapeHtml(part.name)}</option>`).join('');
}

function memberPartFilterOptions() {
  return `<option value="all" ${selectedMemberPart === 'all' ? 'selected' : ''}>${t('common.all')}</option>` +
    state.parts
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((part) => `<option value="${part.id}" ${selectedMemberPart === part.id ? 'selected' : ''}>${escapeHtml(part.name)}</option>`)
      .join('');
}
function stationOptions(selected = '', partFilter = '', compact = false) {
  return state.stations
    .filter((st) => !partFilter || st.partId === partFilter)
    .sort(sortStations)
    .map((st) => {
      const label = compact ? st.name : `${partName(st.partId)} / ${st.name}`;
      return `<option value="${st.id}" ${selected === st.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
    }).join('');
}
function firstStationForPart(partId) {
  return state.stations.filter((st) => st.partId === partId).sort(sortStations)[0]?.id || '';
}
function firstSkillForStation(stationId) {
  return state.skills
    .filter((sk) => !stationId || sk.stationId === stationId)
    .sort((a, b) => a.name.localeCompare(b.name))[0]?.id || '';
}
function skillOptions(selected = '', stationFilter = '', compact = false) {
  return state.skills
    .filter((sk) => !stationFilter || sk.stationId === stationFilter)
    .sort((a, b) => partName(a.partId).localeCompare(partName(b.partId)) || stationName(a.stationId).localeCompare(stationName(b.stationId)) || a.name.localeCompare(b.name))
    .map((sk) => {
      const label = compact ? sk.name : `${partName(sk.partId)} / ${stationName(sk.stationId)} / ${sk.name}`;
      return `<option value="${sk.id}" ${selected === sk.id ? 'selected' : ''}>${escapeHtml(label)}</option>`;
    }).join('');
}
function getSkillLevelTemplates(skillId) {
  return state.levelTemplates
    .filter((tpl) => tpl.skillId === skillId)
    .sort((a, b) => Number(a.levelNumber) - Number(b.levelNumber) || Number(a.stepNumber) - Number(b.stepNumber));
}
function skillLevelComboOptions(selected = '') {
  return state.skills.map((skill) => {
    const templates = getSkillLevelTemplates(skill.id);
    if (!templates.length) {
      const value = `${skill.id}|1|1`;
      return `<option value="${value}" ${selected === value ? 'selected' : ''}>${escapeHtml(skill.name)} · Level 1 / Step 1 · 단계 미정의</option>`;
    }
    return templates.map((tpl) => {
      const value = `${skill.id}|${tpl.levelNumber}|${tpl.stepNumber}`;
      const desc = tpl.description ? ` · ${tpl.description}` : '';
      return `<option value="${value}" ${selected === value ? 'selected' : ''}>${escapeHtml(skill.name)} · Level ${tpl.levelNumber} / Step ${tpl.stepNumber}${escapeHtml(desc)}</option>`;
    }).join('');
  }).join('');
}
function memberSkillSelectOptions(selected = '', stationFilter = '') {
  return state.skills
    .filter((skill) => !stationFilter || skill.stationId === stationFilter)
    .slice()
    .sort((a, b) => partName(a.partId).localeCompare(partName(b.partId)) || stationName(a.stationId).localeCompare(stationName(b.stationId)) || a.name.localeCompare(b.name))
    .map((skill) => `<option value="${skill.id}" ${selected === skill.id ? 'selected' : ''}>${escapeHtml(skill.name)}</option>`)
    .join('');
}
function getMemberSkillDefaults(emp) {
  const partId = emp?.partId || state.parts[0]?.id || '';
  const stationId = firstStationForPart(partId) || state.stations[0]?.id || '';
  const skillId = firstSkillForStation(stationId) || state.skills[0]?.id || '';
  const level = levelsForSkill(skillId)[0] || 1;
  const step = stepsForSkill(skillId, level)[0] || 1;
  return { partId, stationId, skillId, level, step };
}
function uniqueNumbers(values) {
  return [...new Set(values.map((v) => Number(v)).filter((v) => Number.isFinite(v)))].sort((a, b) => a - b);
}
function levelsForSkill(skillId) {
  const levels = uniqueNumbers(getSkillLevelTemplates(skillId).map((tpl) => tpl.levelNumber));
  return levels.length ? levels : [1];
}
function stepsForSkill(skillId, levelNumber) {
  const steps = uniqueNumbers(getSkillLevelTemplates(skillId).filter((tpl) => Number(tpl.levelNumber) === Number(levelNumber)).map((tpl) => tpl.stepNumber));
  return steps.length ? steps : [1];
}
function memberLevelOptions(skillId, selected = '') {
  return levelsForSkill(skillId).map((level) => `<option value="${level}" ${String(selected) === String(level) ? 'selected' : ''}>Level ${level}</option>`).join('');
}
function memberStepOptions(skillId, levelNumber, selected = '') {
  return stepsForSkill(skillId, levelNumber).map((step) => `<option value="${step}" ${String(selected) === String(step) ? 'selected' : ''}>Step ${step}</option>`).join('');
}
function employeeOptions(selected = '', includeBlank = true) {
  return `${includeBlank ? `<option value="">${t('schedule.unassigned')}</option>` : ''}${state.employees.filter(e => e.active).map((emp) => `<option value="${emp.id}" ${selected === emp.id ? 'selected' : ''}>${escapeHtml(emp.name)} · ${escapeHtml(partName(emp.partId))}</option>`).join('')}`;
}
function sortStations(a, b) {
  const pa = byId(state.parts, a.partId)?.sortOrder || 0;
  const pb = byId(state.parts, b.partId)?.sortOrder || 0;
  return pa - pb || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
}

function renderSkills() {
  const el = document.getElementById('skills');
  if (!state.skills.some((skill) => skill.id === selectedSkillId)) selectedSkillId = state.skills[0]?.id || '';
  const selectedSkill = byId(state.skills, selectedSkillId);
  const selectedTemplates = selectedSkill ? getSkillLevelTemplates(selectedSkill.id) : [];
  const groupedLevels = selectedTemplates.reduce((acc, tpl) => {
    const levelKey = String(tpl.levelNumber);
    if (!acc[levelKey]) acc[levelKey] = [];
    acc[levelKey].push(tpl);
    return acc;
  }, {});
  const levelKeys = Object.keys(groupedLevels).sort((a, b) => Number(a) - Number(b));

  const sortedSkills = state.skills
    .slice()
    .sort((a, b) => partName(a.partId).localeCompare(partName(b.partId)) || stationName(a.stationId).localeCompare(stationName(b.stationId)) || a.name.localeCompare(b.name));

  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('tabs.skills')}</h2>
        <p>${t('skills.subtitle')}</p>
      </div>
    </div>

    <div class="card req-guide">
      <strong>${t('skills.guideTitle')}</strong>
      <p class="small-text">${t('skills.guideText')}</p>
    </div>

    <div class="skills-split">
      <section class="card skills-list-card">
        <h3>${t('skills.addSkillTitle')}</h3>
        <div class="form-row compact skill-add-row">
          <label>Part<select id="newSkillPart" data-action="new-skill-part">${partOptions()}</select></label>
          <label>Station<select id="newSkillStation">${stationOptions('', state.parts[0]?.id || '', true)}</select></label>
          <label>Skill 이름<input id="newSkillName" placeholder="예: Fry section" /></label>
          <button class="btn" data-action="add-skill">추가</button>
        </div>

        <div class="table-wrap skills-table-wrap">
          <table class="skills-list-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Station</th>
                <th>Skill</th>
                <th>단계 수</th>
                <th>구분</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${sortedSkills.map((skill) => {
                const isSelected = skill.id === selectedSkillId;
                const count = getSkillLevelTemplates(skill.id).length;
                return `
                  <tr class="${isSelected ? 'selected-skill-row' : ''}">
                    <td>${escapeHtml(partName(skill.partId))}</td>
                    <td>${escapeHtml(stationName(skill.stationId))}</td>
                    <td>
                      <button class="link-btn skill-name-button" data-action="select-skill" data-id="${skill.id}">${escapeHtml(skill.name)}</button>
                    </td>
                    <td><span class="badge ${count ? 'info' : 'warn'}">${count} steps</span></td>
                    <td><span class="badge ${skill.isCritical ? 'danger' : ''}">${skill.isCritical ? 'Critical' : 'Normal'}</span></td>
                    <td class="inline-actions nowrap">
                      <button class="btn small secondary" data-action="select-skill" data-id="${skill.id}">선택</button>
                      <button class="btn small danger" data-action="delete-skill" data-id="${skill.id}">삭제</button>
                    </td>
                  </tr>`;
              }).join('') || '<tr><td colspan="6" class="muted">아직 등록된 Skill이 없다.</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card skill-detail-card">
        ${selectedSkill ? `
          <div class="skill-detail-head">
            <div>
              <h3>${escapeHtml(selectedSkill.name)}</h3>
              <p class="small-text">${escapeHtml(partName(selectedSkill.partId))} / ${escapeHtml(stationName(selectedSkill.stationId))} · ${t('skills.subtitle')}</p>
            </div>
            <span class="badge dark">${t('common.selected')}</span>
          </div>

          <h4>${t('skills.addStepTitle')}</h4>
          <div class="level-add-row clean">
              <label>Level<input data-level-skill="${selectedSkill.id}" data-level-field="level" type="number" value="1" min="0" /></label>
            <label>Step<input data-level-skill="${selectedSkill.id}" data-level-field="step" type="number" value="1" min="0" /></label>
            <label>설명<input data-level-skill="${selectedSkill.id}" data-level-field="desc" placeholder="예: Level 2 직전 단계, 일부 확인 후 업무 가능" /></label>
            <button class="btn small" data-action="add-level" data-skill="${selectedSkill.id}">${t('skills.addLevel')}</button>
          </div>

          <div class="level-summary">
            ${levelKeys.length ? levelKeys.map((levelKey) => {
              const items = groupedLevels[levelKey].sort((a, b) => Number(a.stepNumber) - Number(b.stepNumber));
              return `
                <div class="level-group-card">
                  <div class="level-group-head">
                    <strong>Level ${escapeHtml(levelKey)}</strong>
                    <span class="small-text">${items.length} step${items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div class="table-wrap tight no-border">
                    <table class="compact-table level-detail-table">
                      <thead><tr><th>Step</th><th>설명</th><th>가능 업무</th><th>관리</th></tr></thead>
                      <tbody>
                        ${items.map((tpl) => `
                          <tr>
                            <td><span class="badge info">L${tpl.levelNumber} / S${tpl.stepNumber}</span></td>
                            <td>${escapeHtml(tpl.description || '')}</td>
                            <td>${escapeHtml(tpl.canDo || '') || '<span class="muted">-</span>'}</td>
                            <td><button class="btn small danger" data-action="delete-level" data-id="${tpl.id}">삭제</button></td>
                          </tr>`).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>`;
            }).join('') : '<div class="empty-detail"><p class="muted">이 Skill에는 아직 Level / Step이 없다. 위에서 단계를 추가해라.</p></div>'}
          </div>
        ` : `
          <div class="empty-detail"><h3>선택된 Skill 없음</h3><p class="muted">왼쪽에서 Skill을 추가하거나 선택하면 Level / Step 관리 패널이 열린다.</p></div>
        `}
      </section>
    </div>
  `;
}

function renderMembers() {
  const el = document.getElementById('members');
  if (selectedMemberPart !== 'all' && !state.parts.some((part) => part.id === selectedMemberPart)) selectedMemberPart = 'all';
  const visibleParts = state.parts
    .slice()
    .sort((a,b)=>a.sortOrder-b.sortOrder)
    .filter((part) => selectedMemberPart === 'all' || part.id === selectedMemberPart);
  const grouped = visibleParts
    .map((part) => ({ part, employees: state.employees.filter((emp) => emp.partId === part.id).sort((a,b)=>a.name.localeCompare(b.name)) }))
    .filter((group) => group.employees.length || group.part.active);
  const addPartDefault = selectedMemberPart === 'all' ? '' : selectedMemberPart;

  el.innerHTML = `
    <div class="section-head">
      <div><h2>${t('tabs.members')}</h2><p>${t('members.subtitle')}</p></div>
      <label class="filter-label">${t('members.partFilter')}
        <select data-action="member-part-filter">${memberPartFilterOptions()}</select>
      </label>
    </div>
    <div class="card">
      <h3>${t('members.addEmployeeTitle')}</h3>
      <div class="form-row">
        <label>${t('members.name')}<input id="newEmpName" placeholder="예: Minho" /></label>
        <label>${t('members.part')}<select id="newEmpPart">${partOptions(addPartDefault)}</select></label>
        <label>${t('members.role')}<input id="newEmpRole" placeholder="예: Kitchen Staff" /></label>
        <label>${t('members.rate')}<input id="newEmpRate" type="number" value="28" /></label>
        <label>${t('members.maxHours')}<input id="newEmpMax" type="number" value="38" /></label>
        <button class="btn" data-action="add-employee">${t('members.addEmployee')}</button>
      </div>
    </div>
    ${grouped.map(({ part, employees }) => `
      <h3 class="group-title"><span class="badge dark" style="background:${part.color}">${escapeHtml(part.name)}</span> ${employees.length}명</h3>
      <div class="grid">
        ${employees.map(renderEmployeeCard).join('') || `<p class="muted">${t('members.noEmployeesHere')}</p>`}
      </div>
    `).join('') || `<div class="card"><p class="muted">${t('members.noEmployeesVisible')}</p></div>`}
  `;
}

function renderEmployeeCard(emp) {
  const breakdown = employeeWorkBreakdown(emp.id);
  const hours = breakdown.totalHours;
  const cost = breakdown.totalCost;
  const usage = emp.maxWeeklyHours ? (hours / emp.maxWeeklyHours) * 100 : 0;
  const skillBadges = Object.entries(emp.assignedSkills || {}).map(([skillId, value]) => `<span class="badge info">${escapeHtml(skillName(skillId))} L${value.level}-S${value.step}</span>`).join('') || `<span class="badge">${t('common.noData')}</span>`;
  return `
    <div class="card member-card">
      <div>
        <h3>${escapeHtml(emp.name)}</h3>
        <p class="small-text">${escapeHtml(partName(emp.partId))} · ${escapeHtml(emp.role)} · ${money(emp.baseRate)}/h</p>
        <div>${skillBadges}</div>
        <p class="small-text">${t('members.weekHours')} ${hours.toFixed(1)}h · ${money(cost)} · ${t('members.max')} ${emp.maxWeeklyHours}h</p>
        <div class="work-breakdown mini">
          <span>${t('members.weekday')} ${breakdown.weekdayHours.toFixed(1)}h</span>
          <span>${t('members.saturday')} ${breakdown.saturdayHours.toFixed(1)}h</span>
          <span>${t('members.sunday')} ${breakdown.sundayHours.toFixed(1)}h</span>
        </div>
        <div class="progress ${usage > 100 ? 'danger' : usage > 90 ? 'warn' : ''}"><div style="width:${Math.min(usage,120)}%"></div></div>
        <div class="inline-actions" style="margin-top:10px;">
          <button class="btn small danger" data-action="delete-employee" data-id="${emp.id}">${t('common.delete')}</button>
          <button class="btn small secondary" data-action="toggle-employee" data-id="${emp.id}">${emp.active ? t('members.deactivate') : t('members.activate')}</button>
        </div>
      </div>
      <div>
        <h4>${t('members.availability')}</h4>
        <div class="availability-grid">
          ${DAYS.map((day) => {
            const av = emp.availability?.[day.key] || { available: false, startTime: '10:00', endTime: '22:00' };
            return `<div class="day-box">
              <label><input type="checkbox" ${av.available ? 'checked' : ''} data-action="availability-check" data-emp="${emp.id}" data-day="${day.key}" /> ${dayShort(day.key)}</label>
              <input type="time" value="${av.startTime || '10:00'}" data-action="availability-start" data-emp="${emp.id}" data-day="${day.key}" />
              <input type="time" value="${av.endTime || '22:00'}" data-action="availability-end" data-emp="${emp.id}" data-day="${day.key}" />
            </div>`;
          }).join('')}
        </div>
      </div>
      <div>
        <h4>${t('members.skillLevelStep')}</h4>
        <p class="small-text">${t('members.skillStepHelp')}</p>
        ${(() => {
          const pick = getMemberSkillDefaults(emp);
          return `
            <div class="form-row compact member-skill-editor">
              <label>Part 선택<select data-action="member-skill-part" data-field="memberSkillPart" data-emp="${emp.id}">${partOptions(pick.partId)}</select></label>
              <label>Section 선택<select data-action="member-skill-station" data-field="memberSkillStation" data-emp="${emp.id}">${stationOptions(pick.stationId, pick.partId, true)}</select></label>
              <label>Skill 선택<select data-action="member-skill-select" data-field="memberSkillSelect" data-emp="${emp.id}">${memberSkillSelectOptions(pick.skillId, pick.stationId)}</select></label>
              <label>Level 선택<select data-action="member-level-select" data-field="memberLevelSelect" data-emp="${emp.id}">${memberLevelOptions(pick.skillId, pick.level)}</select></label>
              <label>Step 선택<select data-field="memberStepSelect" data-emp="${emp.id}">${memberStepOptions(pick.skillId, pick.level, pick.step)}</select></label>
            </div>
          `;
        })()}
        <button class="btn small" data-action="assign-skill" data-id="${emp.id}">${t('members.assignSkill')}</button>
        <div style="margin-top:10px;">
          ${Object.keys(emp.assignedSkills || {}).map((skillId) => `<button class="btn small ghost" data-action="remove-emp-skill" data-emp="${emp.id}" data-skill="${skillId}">${escapeHtml(skillName(skillId))} L${emp.assignedSkills[skillId].level}-S${emp.assignedSkills[skillId].step} ${t('members.removeSkill')}</button>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderDayPills(selectedDay, actionName) {
  return `<div class="day-pills">
    ${DAYS.map((day) => `<button class="day-pill ${selectedDay === day.key ? 'active' : ''}" data-action="${actionName}" data-day="${day.key}">${dayShort(day.key)}</button>`).join('')}
  </div>`;
}

function renderRequirements() {
  const el = document.getElementById('requirements');
  const visibleDay = selectedRequirementDay || 'monday';
  const visibleReqs = state.requirements
    .filter((req) => req.dayOfWeek === visibleDay)
    .sort((a,b)=>toMinutes(a.startTime)-toMinutes(b.startTime));
  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('tabs.requirements')}</h2>
        <p>${t('requirements.subtitle')}</p>
      </div>
    </div>
    <div class="card req-guide">
      <strong>${t('requirements.guideTitle')}</strong>
      <p class="small-text">${t('requirements.guideText')}</p>
    </div>
    <div class="card req-toolbar">
      <div>
        <h3>${t('requirements.daySelect')}</h3>
        ${renderDayPills(visibleDay, 'req-day')}
      </div>
      <div>
        <h3>${t('requirements.addBlockTitle')}</h3>
        <div class="req-block-row">
          <label>${t('requirements.day')}<select id="newReqDay">${DAYS.map(d => `<option value="${d.key}" ${d.key === visibleDay ? 'selected' : ''}>${dayLabel(d.key)}</option>`).join('')}</select></label>
          <label>${t('requirements.start')}<input id="newReqStart" type="time" value="10:00" /></label>
          <label>${t('requirements.end')}<input id="newReqEnd" type="time" value="12:00" /></label>
          <label>${t('requirements.label')}<input id="newReqLabel" placeholder="예: Dinner Peak" /></label>
          <label>${t('requirements.peak')}<select id="newReqPeak"><option value="false">No</option><option value="true">Yes</option></select></label>
          <button class="btn" data-action="add-requirement">${t('requirements.addBlock')}</button>
        </div>
      </div>
    </div>
    <div class="req-day-board">
      <h3 class="group-title">${dayLabel(visibleDay)} ${t('tabs.requirements')}</h3>
      ${visibleReqs.map(renderRequirementCard).join('') || '<div class="card"><p class="muted">이 요일에는 아직 시간 블록이 없다.</p></div>'}
    </div>
  `;
}

function renderRequirementCard(req) {
  const rows = getRequirementSeatRows().filter((row) => row.req.id === req.id);
  const seatCount = rows.length;
  req.minTotalStaff = seatCount;
  req.recommendedTotalStaff = seatCount;
  const grouped = rows.reduce((acc, row) => {
    const key = `${row.sreq.partId}__${row.sreq.stationId}__${row.sreq.minLevel}__${row.sreq.minStep}`;
    if (!acc[key]) acc[key] = { ...row, count: 0 };
    acc[key].count += 1;
    return acc;
  }, {});
  const summary = Object.values(grouped).map((g) => `${partName(g.sreq.partId)} / ${stationName(g.sreq.stationId)} × ${g.count}`).join(' · ') || '자리 없음';
  return `
    <div class="card req-card simple-req-card">
      <div class="req-card-head">
        <div>
          <h3>${escapeHtml(req.label)} <span class="badge ${req.isPeak ? 'danger' : 'info'}">${req.startTime}–${req.endTime}</span></h3>
          <p class="small-text">${t('requirements.requiredSeats')} ${seatCount} · ${escapeHtml(summary)}</p>
        </div>
        <button class="btn small danger" data-action="delete-requirement" data-id="${req.id}">${t('requirements.deleteBlock')}</button>
      </div>
      <div class="req-seat-add-row">
        <label>${t('requirements.part')}<select data-action="req-part-select" data-req-field="part" data-req="${req.id}">${partOptions()}</select></label>
        <label>${t('requirements.station')}<select data-req-field="station" data-req="${req.id}">${stationOptions('', state.parts[0]?.id || '', true)}</select></label>
        <label>${t('requirements.min')} Level<input type="number" value="1" min="0" data-req-field="level" data-req="${req.id}" /></label>
        <label>${t('requirements.min')} Step<input type="number" value="1" min="0" data-req-field="step" data-req="${req.id}" /></label>
        <button class="btn small" data-action="add-station-req" data-id="${req.id}">${t('requirements.seatAdd')}</button>
      </div>
      <div class="req-seat-table">
        <table class="simple-table compact-table"><thead><tr><th>#</th><th>${t('requirements.part')}</th><th>${t('requirements.station')}</th><th>${t('requirements.skill')}</th><th>${t('requirements.min')}</th><th>${t('common.delete')}</th></tr></thead><tbody>
          ${rows.map((row, idx) => `<tr>
            <td>${idx + 1}</td>
            <td>${escapeHtml(partName(row.sreq.partId))}</td>
            <td><strong>${escapeHtml(stationName(row.sreq.stationId))}</strong></td>
            <td>${escapeHtml(requiredSkillName(row.sreq))}</td>
            <td>L${row.sreq.minLevel}-S${row.sreq.minStep}</td>
            <td class="inline-actions"><button class="btn small secondary" data-action="clone-station-req" data-req="${req.id}" data-id="${row.sreq.id}">${t('requirements.cloneSeat')}</button><button class="btn small danger" data-action="delete-station-req" data-req="${req.id}" data-id="${row.sreq.id}">${t('common.delete')}</button></td>
          </tr>`).join('') || `<tr><td colspan="6" class="muted">${t('requirements.noSeats')}</td></tr>`}
        </tbody></table>
      </div>
    </div>
  `;
}

function renderSchedule() {
  const el = document.getElementById('schedule');
  if (!['sheet', 'confirmed', 'member', 'part', 'time'].includes(scheduleView)) scheduleView = 'sheet';
  const showDayTabs = scheduleView === 'sheet';
  el.innerHTML = `
    <div class="section-head">
      <div><h2>${t('tabs.schedule')}</h2><p>${t('schedule.subtitle')}</p></div>
      <div class="inline-actions">
        <button class="btn ${scheduleView === 'sheet' ? '' : 'secondary'}" data-action="schedule-view" data-view="sheet">${t('schedule.sheet')}</button>
        <button class="btn ${scheduleView === 'confirmed' ? '' : 'secondary'}" data-action="schedule-view" data-view="confirmed">${t('schedule.confirmed')}</button>
        <button class="btn ${scheduleView === 'member' ? '' : 'secondary'}" data-action="schedule-view" data-view="member">${t('schedule.member')}</button>
        <button class="btn ${scheduleView === 'part' ? '' : 'secondary'}" data-action="schedule-view" data-view="part">${t('schedule.part')}</button>
      </div>
    </div>
    ${showDayTabs ? renderDayPills(selectedScheduleDay, 'schedule-day') : ''}
    ${scheduleView === 'sheet' ? renderRosterSheet() : scheduleView === 'confirmed' ? renderConfirmedRoster() : scheduleView === 'member' ? renderScheduleMemberView() : scheduleView === 'part' ? renderSchedulePartView() : renderScheduleTimeView()}
    ${recommendationContext ? renderRecommendationPanel() : ''}
    ${replacementContext ? renderReplacementPanel() : ''}
  `;
}

function getAssignmentStatus(req, sreq, key) {
  const employeeId = state.schedule[key];
  if (!employeeId) return { label: '미배정', className: 'danger', detail: '직원을 선택하세요.' };
  const employee = byId(state.employees, employeeId);
  if (!employee) return { label: '직원 없음', className: 'danger', detail: '삭제된 직원입니다.' };
  const status = getCandidateStatus(employee, req, sreq, key);
  if (status.category === 'fit') return { label: '적합', className: 'ok', detail: status.reasons.join(' · ') };
  if (status.category === 'partial') return { label: '주의', className: 'warn', detail: status.reasons.join(' · ') };
  if (status.category === 'emergency') return { label: '긴급', className: 'warn', detail: status.reasons.join(' · ') };
  return { label: '부적합', className: 'danger', detail: status.reasons.join(' · ') };
}

function employeeOptionsForRequirement(req, sreq, selected = '', ignoreKey = '') {
  const key = ignoreKey || assignmentKey(req.id, sreq.id, 0);
  const recommendations = getRecommendations(req, sreq, '', key)
    .filter((rec) => ['fit', 'partial', 'emergency'].includes(rec.category));
  const selectedEmployee = selected ? byId(state.employees, selected) : null;
  const selectedIncluded = recommendations.some((rec) => rec.employee.id === selected);
  const options = ['<option value="">미배정</option>'];
  if (selectedEmployee && !selectedIncluded) {
    options.push(`<option value="${selectedEmployee.id}" selected>${escapeHtml(selectedEmployee.name)} · 현재 배정(조건 미달)</option>`);
  }
  recommendations.forEach((rec) => {
    const mark = rec.category === 'fit' ? '적합' : rec.category === 'partial' ? '주의' : '긴급';
    options.push(`<option value="${rec.employee.id}" ${selected === rec.employee.id ? 'selected' : ''}>${escapeHtml(rec.employee.name)} · ${mark} · ${escapeHtml(partName(rec.employee.partId))}</option>`);
  });
  if (options.length === 1) options.push('<option disabled>조건에 맞는 직원 없음</option>');
  return options.join('');
}

function getDayRequirements(dayKey) {
  return state.requirements
    .filter((req) => req.dayOfWeek === dayKey)
    .sort((a,b)=>toMinutes(a.startTime)-toMinutes(b.startTime));
}

function stationSortValue(stationId) {
  return num(byId(state.stations, stationId)?.sortOrder, 999);
}

function partSortValue(partId) {
  return num(byId(state.parts, partId)?.sortOrder, 999);
}

function getHorizontalRosterData(dayKey) {
  const reqs = getDayRequirements(dayKey);
  const rowMap = new Map();

  reqs.forEach((req) => {
    const localCounts = {};
    (req.stationRequirements || [])
      .slice()
      .sort((a, b) =>
        partSortValue(a.partId) - partSortValue(b.partId) ||
        stationSortValue(a.stationId) - stationSortValue(b.stationId) ||
        stationName(a.stationId).localeCompare(stationName(b.stationId))
      )
      .forEach((sreq) => {
        const count = Math.max(1, Number(sreq.requiredCount || 1));
        for (let slotIndex = 0; slotIndex < count; slotIndex += 1) {
          const pairKey = `${sreq.partId}__${sreq.stationId}`;
          const occurrence = localCounts[pairKey] || 0;
          localCounts[pairKey] = occurrence + 1;
          const rowId = `${pairKey}__${occurrence}`;
          if (!rowMap.has(rowId)) {
            rowMap.set(rowId, {
              id: rowId,
              partId: sreq.partId,
              stationId: sreq.stationId,
              occurrence,
              cells: {},
            });
          }
          rowMap.get(rowId).cells[req.id] = { req, sreq, slotIndex, key: assignmentKey(req.id, sreq.id, slotIndex) };
        }
      });
  });

  const rows = [...rowMap.values()].sort((a,b) =>
    partSortValue(a.partId) - partSortValue(b.partId) ||
    stationSortValue(a.stationId) - stationSortValue(b.stationId) ||
    a.occurrence - b.occurrence
  );
  return { reqs, rows };
}

function renderRosterCell(cell) {
  if (!cell) return '<td class="empty-cell"><span>—</span></td>';
  const { req, sreq, slotIndex, key } = cell;
  const selected = state.schedule[key] || '';
  const status = getAssignmentStatus(req, sreq, key);
  return `<td class="matrix-cell ${status.className}">
    <select class="matrix-select" data-action="assign-schedule" data-key="${key}">${employeeOptionsForRequirement(req, sreq, selected, key)}</select>
    <div class="cell-meta"><span class="badge ${status.className}">${status.label}</span></div>
    <div class="matrix-actions">
      <button class="link-btn" data-action="show-recommend" data-req="${req.id}" data-sreq="${sreq.id}" data-slot="${slotIndex}">추천</button>
      <button class="link-btn" data-action="show-replace" data-req="${req.id}" data-sreq="${sreq.id}" data-slot="${slotIndex}" ${selected ? '' : 'disabled'}>대체</button>
    </div>
  </td>`;
}

function summarizeHorizontalRow(row, reqs) {
  const statuses = reqs
    .map((req) => row.cells[req.id])
    .filter(Boolean)
    .map((cell) => getAssignmentStatus(cell.req, cell.sreq, cell.key));
  if (!statuses.length) return { label: '해당 없음', className: 'info', detail: '' };
  const missing = statuses.filter((s) => s.label === '미배정').length;
  const danger = statuses.filter((s) => s.className === 'danger').length;
  const warn = statuses.filter((s) => s.className === 'warn').length;
  const ok = statuses.filter((s) => s.className === 'ok').length;
  const requirementSamples = reqs
    .map((req) => row.cells[req.id])
    .filter(Boolean)
    .map((cell) => `${requiredSkillName(cell.sreq)} L${cell.sreq.minLevel}-S${cell.sreq.minStep}`);
  const uniqueReqs = [...new Set(requirementSamples)];
  if (missing || danger) return { label: `미배정/위험 ${missing || danger}`, className: 'danger', detail: uniqueReqs.join(' · ') };
  if (warn) return { label: `주의 ${warn}`, className: 'warn', detail: uniqueReqs.join(' · ') };
  return { label: `적합 ${ok}`, className: 'ok', detail: uniqueReqs.join(' · ') };
}

function renderRosterSheet() {
  const { reqs, rows } = getHorizontalRosterData(selectedScheduleDay);
  return `
    <div class="card sheet-card horizontal-roster-card">
      <div class="section-head">
        <div>
          <h3>${dayLabel(selectedScheduleDay)} ${t('schedule.sheet')}</h3>
          <p class="small-text">${t('schedule.rosterHint')}</p>
        </div>
        <button class="btn small secondary" data-action="export-roster-csv">${t('schedule.csv')}</button>
      </div>
      <div class="table-wrap roster-wrap horizontal-roster-wrap">
        <table class="horizontal-roster-table">
          <thead>
            <tr>
              <th class="sticky-col col-part">Part</th>
              <th class="sticky-col col-station">Station</th>
              <th class="sticky-col col-seat">Seat</th>
              ${reqs.map((req) => `<th class="time-col"><strong>${req.startTime}–${req.endTime}</strong><br><span>${escapeHtml(req.label)}</span>${req.isPeak ? '<br><span class="badge danger">Peak</span>' : ''}</th>`).join('')}
              <th class="status-col">Status / Required</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => {
              const summary = summarizeHorizontalRow(row, reqs);
              return `<tr>
                <td class="sticky-col col-part"><strong>${escapeHtml(partName(row.partId))}</strong></td>
                <td class="sticky-col col-station">${escapeHtml(stationName(row.stationId))}</td>
                <td class="sticky-col col-seat">#${row.occurrence + 1}</td>
                ${reqs.map((req) => renderRosterCell(row.cells[req.id])).join('')}
                <td class="status-col"><span class="badge ${summary.className}">${summary.label}</span><div class="status-detail wide">${escapeHtml(summary.detail)}</div></td>
              </tr>`;
            }).join('') || `<tr><td colspan="${4 + reqs.length}" class="muted">이 요일에는 Requirements에서 추가된 자리가 없다.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function partCategory(partId) {
  const name = (partName(partId) || '').toLowerCase();
  if (name.includes('kitchen') || name.includes('주방')) return 'kitchen';
  if (name.includes('hall') || name.includes('홀') || name.includes('barista') || name.includes('바리스타') || name === 'bar' || name.includes(' bar') || name.includes('바')) return 'hallbarista';
  return 'other';
}


function phaseKeyFromReq(req) {
  return `${req.startTime}__${req.endTime}__${req.label || ''}`;
}

function getConfirmedRosterData() {
  const requirements = state.requirements.slice().sort((a, b) =>
    toMinutes(a.startTime) - toMinutes(b.startTime) ||
    (a.label || '').localeCompare(b.label || '')
  );
  const phaseMap = new Map();
  requirements.forEach((req) => {
    const key = phaseKeyFromReq(req);
    if (!phaseMap.has(key)) {
      phaseMap.set(key, {
        key,
        startTime: req.startTime,
        endTime: req.endTime,
        label: req.label || '',
      });
    }
  });
  const phases = [...phaseMap.values()].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime) || a.label.localeCompare(b.label));
  phases.forEach((phase, index) => { phase.phaseNo = index + 1; });

  const reqByDayPhase = new Map();
  state.requirements.forEach((req) => {
    reqByDayPhase.set(`${req.dayOfWeek}__${phaseKeyFromReq(req)}`, req);
  });

  const activePartIds = new Set();
  state.requirements.forEach((req) => {
    (req.stationRequirements || []).forEach((sreq) => activePartIds.add(sreq.partId));
  });

  const partsForPrint = state.parts
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((part) => activePartIds.has(part.id));

  const sections = partsForPrint.map((part) => {
    const rows = [];
    phases.forEach((phase) => {
      const row = { phase, cells: {}, hasContent: false };
      DAYS.forEach((day) => {
        const req = reqByDayPhase.get(`${day.key}__${phase.key}`);
        if (!req) {
          row.cells[day.key] = null;
          return;
        }
        const localCounts = {};
        const items = [];
        (req.stationRequirements || [])
          .slice()
          .sort((a, b) => stationSortValue(a.stationId) - stationSortValue(b.stationId) || stationName(a.stationId).localeCompare(stationName(b.stationId)))
          .forEach((sreq) => {
            if (sreq.partId !== part.id) return;
            const count = Math.max(1, Number(sreq.requiredCount || 1));
            for (let slotIndex = 0; slotIndex < count; slotIndex += 1) {
              const pairKey = `${sreq.partId}__${sreq.stationId}`;
              const occurrence = localCounts[pairKey] || 0;
              localCounts[pairKey] = occurrence + 1;
              const assignmentKeyValue = assignmentKey(req.id, sreq.id, slotIndex);
              const employeeId = state.schedule[assignmentKeyValue] || '';
              items.push({ req, sreq, slotIndex, occurrence, key: assignmentKeyValue, employeeId });
              row.hasContent = true;
            }
          });
        row.cells[day.key] = items;
      });
      if (row.hasContent) rows.push(row);
    });
    return { key: part.id, label: part.name, color: part.color, rows };
  });

  return { phases, sections };
}

function renderConfirmedCell(items) {
  if (items === null) return '<td class="confirmed-empty"></td>';
  if (!items || !items.length) return '<td class="confirmed-blank"></td>';
  return `<td class="confirmed-phase-assignments">
    <div class="confirmed-cell-list">
      ${items.map((item) => {
        const station = stationName(item.sreq.stationId);
        const employee = item.employeeId ? employeeName(item.employeeId) : '';
        const status = getAssignmentStatus(item.req, item.sreq, item.key);
        const className = employee ? status.className : 'missing-name';
        const occurrenceLabel = item.occurrence ? ` #${item.occurrence + 1}` : '';
        return `<div class="confirmed-line ${className}"><span class="work-name">${escapeHtml(station)}${occurrenceLabel} :</span> <span class="employee-name">${escapeHtml(employee)}</span></div>`;
      }).join('')}
    </div>
  </td>`;
}

function renderConfirmedRoster() {
  const { sections } = getConfirmedRosterData();
  return `
    <div class="card sheet-card confirmed-print-card">
      <div class="section-head no-print">
        <div>
          <h3>${t('schedule.weeklyRoster')}</h3>
          <p class="small-text">${t('schedule.confirmedHint')}</p>
        </div>
        <div class="inline-actions">
          <button class="btn small secondary" data-action="export-roster-csv">${t('schedule.csv')}</button>
          <button class="btn small secondary" data-action="print-confirmed-roster">${t('schedule.print')}</button>
        </div>
      </div>
      <div class="confirmed-print-title print-only">
        <h2>${t('schedule.weeklyRoster')}</h2>
        <p>SkillShift Planner</p>
      </div>
      <div class="confirmed-sections">
        ${sections.map((section) => `
          <div class="confirmed-section">
            <div class="confirmed-category-title" style="background:${section.color || '#111827'}">${escapeHtml(section.label)}</div>
            <div class="table-wrap roster-wrap confirmed-week-wrap">
              <table class="confirmed-week-matrix compact-confirmed-matrix">
                <thead>
                  <tr>
                    <th class="phase-column">${t('schedule.phase')} / ${t('schedule.time')}</th>
                    ${DAYS.map((day) => `<th>${dayLabel(day.key)}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${section.rows.map((row) => `
                    <tr>
                      <td class="phase-cell"><strong>Phase ${row.phase.phaseNo}</strong><br><span>${row.phase.startTime}–${row.phase.endTime}</span><br><em>${escapeHtml(row.phase.label)}</em></td>
                      ${DAYS.map((day) => renderConfirmedCell(row.cells[day.key])).join('')}
                    </tr>
                  `).join('') || `<tr><td colspan="8" class="muted">${t('schedule.noPartWork')}</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `).join('') || `<p class="muted">${t('schedule.noRequirements')}</p>`}
      </div>
    </div>
  `;
}
function renderScheduleTimeView() {
  return DAYS.map((day) => {
    const reqs = state.requirements.filter((req) => req.dayOfWeek === day.key).sort((a,b)=>toMinutes(a.startTime)-toMinutes(b.startTime));
    return `<div class="schedule-day"><h3 class="group-title">${dayLabel(day.key)}</h3><div class="grid">${reqs.map(renderScheduleSlot).join('') || `<p class="muted">${t('schedule.noTimeBlocks')}</p>`}</div></div>`;
  }).join('');
}

function renderScheduleSlot(req) {
  const slotIssues = calculateValidation().filter((issue) => issue.req?.id === req.id);
  const status = slotIssues.some(i => i.severity === 'high') ? 'danger' : slotIssues.length ? 'warn' : 'ok';
  return `
    <div class="card slot-card ${status}">
      <div class="section-head" style="margin-bottom:4px;">
        <div><h3>${escapeHtml(req.label)} <span class="badge ${req.isPeak ? 'danger' : 'info'}">${req.startTime}–${req.endTime}</span></h3><p class="small-text">${dayLabel(req.dayOfWeek)} · ${req.isPeak ? t('schedule.peak') : t('schedule.normal')} · ${durationHours(req.startTime, req.endTime).toFixed(1)}h</p></div>
        <span class="badge ${status === 'ok' ? 'ok' : status === 'warn' ? 'warn' : 'danger'}">${status === 'ok' ? t('schedule.ok') : status === 'warn' ? t('schedule.caution') : t('schedule.urgent')}</span>
      </div>
      ${req.stationRequirements.map((sreq) => renderStationAssignment(req, sreq)).join('')}
    </div>
  `;
}

function renderStationAssignment(req, sreq) {
  const slots = Array.from({ length: Number(sreq.requiredCount || 1) }, (_, i) => i);
  return `
    <div class="station-row">
      <div>
        <strong>${escapeHtml(partName(sreq.partId))} / ${escapeHtml(stationName(sreq.stationId))}</strong>
        <p class="small-text">${escapeHtml(requiredSkillName(sreq))} · Min L${sreq.minLevel}-S${sreq.minStep} · ${sreq.requiredCount || 1}명</p>
      </div>
      <div class="assignment-list">
        ${slots.map((slotIndex) => {
          const key = assignmentKey(req.id, sreq.id, slotIndex);
          const assigned = state.schedule[key] || '';
          return `<div class="assignment-box">
            <select data-action="assign-schedule" data-key="${key}">${employeeOptionsForRequirement(req, sreq, assigned)}</select>
            <button class="btn small secondary" data-action="show-recommend" data-req="${req.id}" data-sreq="${sreq.id}" data-slot="${slotIndex}">${t('schedule.recommend')}</button>
            <button class="btn small ghost" data-action="show-replace" data-req="${req.id}" data-sreq="${sreq.id}" data-slot="${slotIndex}" ${assigned ? '' : 'disabled'}>${t('schedule.replace')}</button>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderRecommendationPanel() {
  const { reqId, sreqId, slotIndex } = recommendationContext;
  const req = getReqById(reqId);
  const sreq = getStationReq(reqId, sreqId);
  if (!req || !sreq) return '';
  const key = assignmentKey(reqId, sreqId, slotIndex);
  const recs = getRecommendations(req, sreq, '', key);
  return `<div class="card recommend-panel">
    <div class="section-head"><div><h3>추천 직원 · ${dayLabel(req.dayOfWeek)} ${req.startTime}–${req.endTime} / ${partName(sreq.partId)} / ${stationName(sreq.stationId)}</h3><p class="small-text">필요: ${requiredSkillName(sreq)} L${sreq.minLevel}-S${sreq.minStep}</p></div><button class="btn small secondary" data-action="close-panels">닫기</button></div>
    ${renderRecommendationGroups(recs, key)}
  </div>`;
}

function renderReplacementPanel() {
  const { reqId, sreqId, slotIndex } = replacementContext;
  const req = getReqById(reqId);
  const sreq = getStationReq(reqId, sreqId);
  const key = assignmentKey(reqId, sreqId, slotIndex);
  const original = state.schedule[key];
  if (!req || !sreq || !original) return '';
  const originalEmp = byId(state.employees, original);
  const originalCost = originalEmp ? durationHours(req.startTime, req.endTime) * getRate(originalEmp, req.dayOfWeek) : 0;
  const recs = getRecommendations(req, sreq, original, key).map((rec) => ({ ...rec, costDiff: rec.addedCost - originalCost }));
  return `<div class="card recommend-panel">
    <div class="section-head"><div><h3>대체근무자 추천 · ${employeeName(original)} 대체</h3><p class="small-text">${dayLabel(req.dayOfWeek)} ${req.startTime}–${req.endTime} / ${partName(sreq.partId)} / ${stationName(sreq.stationId)} · 기존 비용 ${money(originalCost)}</p></div><button class="btn small secondary" data-action="close-panels">닫기</button></div>
    ${renderRecommendationGroups(recs, key, true)}
  </div>`;
}

function renderRecommendationGroups(recs, key, isReplacement = false) {
  const labels = { fit: '완전 적합', partial: '부분 적합', emergency: '긴급 대체 가능', bad: '부적합' };
  return ['fit', 'partial', 'emergency', 'bad'].map((cat) => {
    const group = recs.filter((r) => r.category === cat).slice(0, cat === 'bad' ? 5 : 8);
    if (!group.length) return '';
    const cls = cat === 'fit' ? 'ok' : cat === 'partial' ? 'warn' : cat === 'emergency' ? 'info' : 'danger';
    return `<div style="margin-top:12px;"><h4><span class="badge ${cls}">${labels[cat]}</span></h4><div class="grid two">
      ${group.map((rec) => `<div class="card soft">
        <h4>${escapeHtml(rec.employee.name)} <span class="badge">Score ${rec.score.toFixed(0)}</span></h4>
        <p class="small-text">${escapeHtml(partName(rec.employee.partId))} · ${money(rec.employee.baseRate)}/h · 주간 예상 ${rec.projectedHours.toFixed(1)}h</p>
        ${isReplacement ? `<p class="small-text">기존 대비 비용 차이: <strong>${rec.costDiff >= 0 ? '+' : ''}${money(rec.costDiff)}</strong></p>` : ''}
        <p class="small-text">${rec.reasons.map(escapeHtml).join('<br>')}</p>
        ${cat !== 'bad' ? `<button class="btn small" data-action="apply-recommend" data-key="${key}" data-emp="${rec.employee.id}">이 직원 배치</button>` : ''}
      </div>`).join('')}
    </div></div>`;
  }).join('');
}

function renderScheduleMemberView() {
  return `<div class="grid">${state.employees.map((emp) => {
    const assignments = getAssignments().filter((a) => a.employeeId === emp.id).sort((a,b) => {
      const ra = getReqById(a.reqId); const rb = getReqById(b.reqId);
      return DAYS.findIndex(d=>d.key===ra?.dayOfWeek) - DAYS.findIndex(d=>d.key===rb?.dayOfWeek) || toMinutes(ra?.startTime) - toMinutes(rb?.startTime);
    });
    return `<div class="card"><h3>${escapeHtml(emp.name)} <span class="badge info">${employeeWeeklyHours(emp.id).toFixed(1)}h</span> <span class="badge">${money(employeeWeeklyCost(emp.id))}</span></h3>
      ${assignments.map((a) => {
        const req = getReqById(a.reqId); const sreq = getStationReq(a.reqId, a.stationReqId);
        return `<span class="badge ${req?.isPeak ? 'danger' : 'info'}">${dayLabel(req?.dayOfWeek)} ${req?.startTime}–${req?.endTime} · ${stationName(sreq?.stationId)}</span>`;
      }).join('') || '<p class="muted">배정 없음</p>'}
    </div>`;
  }).join('')}</div>`;
}

function renderSchedulePartView() {
  return state.parts.map((part) => {
    const partAssignments = getAssignments().filter((a) => {
      const sreq = getStationReq(a.reqId, a.stationReqId);
      return sreq?.partId === part.id;
    });
    const cost = partAssignments.reduce((sum, a) => {
      const emp = byId(state.employees, a.employeeId); const req = getReqById(a.reqId);
      return emp && req ? sum + durationHours(req.startTime, req.endTime) * getRate(emp, req.dayOfWeek) : sum;
    }, 0);
    return `<div class="card" style="margin-bottom:14px;"><h3><span class="badge dark" style="background:${part.color}">${escapeHtml(part.name)}</span> ${partAssignments.length} assignments · ${money(cost)}</h3>
      ${partAssignments.map((a) => {
        const req = getReqById(a.reqId); const sreq = getStationReq(a.reqId, a.stationReqId);
        return `<span class="badge ${req?.isPeak ? 'danger' : 'info'}">${dayLabel(req?.dayOfWeek)} ${req?.startTime}–${req?.endTime} · ${stationName(sreq?.stationId)} · ${employeeName(a.employeeId)}</span>`;
      }).join('') || '<p class="muted">배정 없음</p>'}
    </div>`;
  }).join('');
}

function renderLabor() {
  const cost = totalLaborCost();
  const budget = num(state.settings.laborBudget);
  const ratio = budget ? (cost / budget) * 100 : 0;
  const targetRatio = num(state.settings.targetLaborRatio) / 100;
  const neededSales = targetRatio ? cost / targetRatio : 0;
  const status = ratio > 100 ? 'danger' : ratio >= 90 ? 'warn' : '';

  const employeeRows = state.employees.map((emp) => {
    const bd = employeeWorkBreakdown(emp.id);
    return `<tr>
      <td>${escapeHtml(emp.name)}</td>
      <td>${escapeHtml(partName(emp.partId))}</td>
      <td>${bd.weekdayHours.toFixed(1)}h</td>
      <td>${bd.saturdayHours.toFixed(1)}h</td>
      <td>${bd.sundayHours.toFixed(1)}h</td>
      <td><strong>${bd.totalHours.toFixed(1)}h</strong></td>
      <td>${money(bd.totalCost)}</td>
      <td>${emp.maxWeeklyHours}h</td>
    </tr>`;
  }).join('');
  const partRows = state.parts.map((part) => {
    const ids = state.employees.filter((e) => e.partId === part.id).map((e) => e.id);
    const h = ids.reduce((sum, id) => sum + employeeWeeklyHours(id), 0);
    const c = ids.reduce((sum, id) => sum + employeeWeeklyCost(id), 0);
    return `<tr><td>${escapeHtml(part.name)}</td><td>${h.toFixed(1)}h</td><td>${money(c)}</td></tr>`;
  }).join('');

  el = document.getElementById('labor');
  el.innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.labor')}</h2><p>${t('labor.subtitle')}</p></div></div>
    <div class="grid four">
      ${metricCard(t('labor.labor'), money(cost), t('labor.usageBase'), status)}
      ${metricCard(t('labor.budget'), money(budget), ratio > 100 ? t('dashboard.overBudget', { amount: money(cost - budget) }) : t('dashboard.remainingBudget', { amount: money(budget - cost) }))}
      ${metricCard(t('labor.usage'), `${ratio.toFixed(1)}%`, t('labor.usageBase'), status)}
      ${metricCard(t('labor.neededSales'), money(neededSales), t('labor.ratioBase', { ratio: state.settings.targetLaborRatio }))}
    </div>
    <div class="card" style="margin-top:14px;"><h3>${t('labor.progress')}</h3><div class="progress ${status}"><div style="width:${Math.min(ratio,120)}%"></div></div></div>
    <div class="grid two" style="margin-top:14px;">
      <div class="card wide-card"><h3>${t('labor.byEmployee')}</h3><div class="table-wrap"><table><thead><tr><th>${t('labor.employee')}</th><th>${t('labor.part')}</th><th>${t('labor.weekday')}</th><th>${t('labor.saturday')}</th><th>${t('labor.sunday')}</th><th>${t('labor.total')}</th><th>${t('labor.labor')}</th><th>${t('labor.max')}</th></tr></thead><tbody>${employeeRows}</tbody></table></div></div>
      <div class="card"><h3>${t('labor.byPart')}</h3><div class="table-wrap"><table><thead><tr><th>${t('labor.part')}</th><th>${t('labor.total')}</th><th>${t('labor.labor')}</th></tr></thead><tbody>${partRows}</tbody></table></div></div>
    </div>
  `;
}

function renderValidation() {
  const issues = calculateValidation();
  const el = document.getElementById('validation');
  el.innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.validation')}</h2><p>${t('validation.subtitle')}</p></div></div>
    <div class="grid">
      ${issues.map((issue) => `<div class="card issue ${issue.severity === 'high' ? 'high' : issue.severity === 'low' ? 'low' : ''}">
        <h3>${escapeHtml(issue.type)} <span class="badge ${issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warn' : 'info'}">${issue.severity}</span></h3>
        <p>${escapeHtml(issue.message)}</p>
        ${issue.req ? `<p class="small-text">${dayLabel(issue.req.dayOfWeek)} ${issue.req.startTime}–${issue.req.endTime} · ${escapeHtml(issue.req.label || '')}</p>` : ''}
        ${issue.sreq ? `<p class="small-text">${escapeHtml(partName(issue.sreq.partId))} / ${escapeHtml(stationName(issue.sreq.stationId))} · 필요 ${escapeHtml(requiredSkillName(issue.sreq))} L${issue.sreq.minLevel}-S${issue.sreq.minStep}</p>` : ''}
      </div>`).join('') || `<div class="card"><h3>${t('validation.resultTitle')}</h3><span class="badge ok">${t('validation.noIssues')}</span></div>`}
    </div>
  `;
}

function renderRoadmap() {
  const items = [
    ['완전 자동 스케줄 생성', '현재는 추천 기반 배치다. 향후 Requirements, Members, Availability, Level/Step, Labor Budget을 기준으로 주간 스케줄을 자동 생성한다.'],
    ['직원용 모바일 페이지', '직원이 가능 시간, 휴무 요청, 대체 가능 여부를 직접 제출하는 화면을 분리한다.'],
    ['승인 시스템', '직원이 제출한 휴무/가능 시간은 관리자가 승인해야 스케줄 추천에 반영되도록 한다.'],
    ['실제 출퇴근 기록', '예정 스케줄과 실제 출퇴근 시간을 비교해 차이 시간과 실제 인건비를 계산한다.'],
    ['공휴일 / Penalty Rate / Super / Tax', '현재는 단순 배율 계산만 한다. 향후 호주 기준 penalty rate, allowance, super, tax를 설정값으로 확장한다.'],
    ['매출 연동', '실제 매출 또는 기존 가게 운영 앱의 Sales 데이터와 연결해 실시간 인건비율을 계산한다.'],
    ['직원 성장 관리', 'Level/Step을 교육 기록과 승급 체크리스트로 확장한다. 부족 Station을 기준으로 교육 대상자를 추천한다.'],
    ['직원 의존도 분석', '특정 직원이 빠졌을 때 운영이 무너지는 구조를 감지하고 대체 가능자 부족을 경고한다.'],
    ['알림 기능', '스케줄 확정, 변경, 대체 요청, 인건비 초과, 필수 인력 부족 알림을 구현한다.'],
  ];
  document.getElementById('roadmap').innerHTML = `
    <div class="section-head"><div><h2>${t('tabs.roadmap')}</h2><p>${t('roadmap.subtitle')}</p></div></div>
    <div class="roadmap-list">${items.map(([title, text]) => `<div class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`).join('')}</div>
  `;
}

function renderSettings() {
  const el = document.getElementById('settings');
  const lang = currentLanguage();
  const feedbackEmail = String(state.settings.feedbackEmail || '').trim();
  const feedbackUrl = normalizeExternalUrl(state.settings.feedbackUrl);
  const feedbackEmailHref = mailtoLink(feedbackEmail);
  el.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${t('settings.title')}</h2>
        <p>${t('settings.subtitle')}</p>
      </div>
    </div>
    <div class="grid two">
      <div class="card">
        <h3>${t('settings.languageLabel')}</h3>
        <p class="small-text">${t('settings.languageHelp')}</p>
        <label class="small-text" style="display:grid; gap:6px; max-width: 260px;">
          ${t('settings.current')}
          <select data-setting="language">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>${t('common.korean')}</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>${t('common.english')}</option>
          </select>
        </label>
      </div>
      <div class="card">
        <h3>${t('settings.laborTitle')}</h3>
        <p class="small-text">${t('settings.budgetHelp')}</p>
        <div class="form-row compact" style="grid-template-columns: 1fr 1fr;">
          <label class="small-text" style="display:grid; gap:6px;">
            ${t('settings.budgetLabel')}
            <input type="number" min="0" step="1" value="${state.settings.laborBudget}" data-setting="laborBudget" />
          </label>
          <label class="small-text" style="display:grid; gap:6px;">
            ${t('settings.ratioLabel')}
            <input type="number" min="0" step="0.1" value="${state.settings.targetLaborRatio}" data-setting="targetLaborRatio" />
          </label>
        </div>
        <p class="small-text">${t('settings.ratioHelp')}</p>
      </div>
    </div>
    <div class="section-head" style="margin-top: 24px;">
      <div>
        <h2>${t('settings.supportTitle')}</h2>
        <p>${t('settings.supportSubtitle')}</p>
      </div>
    </div>
    <div class="grid two">
      <div class="card">
        <h3>${t('settings.adTitle')}</h3>
        <p class="small-text">${t('settings.adHelp')}</p>
        <div class="ad-slot">
          <div>
            <strong>${t('settings.adPlaceholder')}</strong>
            <p class="small-text" style="margin: 8px 0 0;">${t('settings.adNote')}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>${t('settings.feedbackTitle')}</h3>
        <p class="small-text">${t('settings.feedbackHelp')}</p>
        <div class="feedback-block" style="margin-top: 8px;">
          <label class="small-text" style="display:grid; gap:6px;">
            ${t('settings.feedbackEmailLabel')}
            <div class="copy-field">
              <input type="text" readonly value="${escapeHtml(feedbackEmail)}" aria-readonly="true" />
              <button class="btn secondary small" type="button" data-action="copy-feedback-email">${t('common.copy')}</button>
            </div>
            <span class="small-text">${t('settings.feedbackEmailHelp')}</span>
          </label>
          <label class="small-text" style="display:grid; gap:6px; margin-top: 12px;">
            ${t('settings.feedbackUrlLabel')}
            <div class="copy-field">
              <input type="text" readonly value="${escapeHtml(feedbackUrl)}" aria-readonly="true" />
              ${feedbackUrl ? `<button class="btn secondary small" type="button" data-action="copy-feedback-link">${t('common.copy')}</button>` : `<button class="btn secondary small" type="button" disabled>${t('common.copy')}</button>`}
            </div>
            <span class="small-text">${t('settings.feedbackUrlHelp')}</span>
          </label>
        </div>
        <div class="inline-actions" style="margin-top: 12px;">
          ${feedbackEmailHref ? `<a class="btn" href="${escapeHtml(feedbackEmailHref)}">${t('settings.feedbackOpenEmail')}</a>` : `<button class="btn" type="button" disabled>${t('settings.feedbackOpenEmail')}</button>`}
          ${feedbackUrl ? `<a class="btn secondary" href="${escapeHtml(feedbackUrl)}" target="_blank" rel="noopener noreferrer">${t('settings.feedbackOpenLink')}</a>` : `<button class="btn secondary" type="button" disabled>${t('settings.feedbackOpenLink')}</button>`}
        </div>
      </div>
    </div>
  `;
}

function handleClick(e) {
  const target = e.target.closest('[data-action], [data-tab]');
  if (!target) return;
  const tab = target.dataset.tab;
  if (tab) {
    activeTab = tab;
    render();
    return;
  }
  const action = target.dataset.action;
  if (!action) return;

  if (action === 'add-part') addPart();
  if (action === 'delete-part') deletePart(target.dataset.id);
  if (action === 'add-station') addStation();
  if (action === 'delete-station') deleteStation(target.dataset.id);
  if (action === 'add-skill') addSkill();
  if (action === 'select-skill') { selectedSkillId = target.dataset.id; render(); }
  if (action === 'delete-skill') deleteSkill(target.dataset.id);
  if (action === 'add-level') addLevel(target.dataset.skill);
  if (action === 'delete-level') deleteLevel(target.dataset.id);
  if (action === 'add-employee') addEmployee();
  if (action === 'delete-employee') deleteEmployee(target.dataset.id);
  if (action === 'toggle-employee') toggleEmployee(target.dataset.id);
  if (action === 'assign-skill') assignSkillToEmployee(target.dataset.id);
  if (action === 'remove-emp-skill') removeEmployeeSkill(target.dataset.emp, target.dataset.skill);
  if (action === 'add-requirement') addRequirement();
  if (action === 'delete-requirement') deleteRequirement(target.dataset.id);
  if (action === 'add-station-req') addStationRequirement(target.dataset.id);
  if (action === 'delete-station-req') deleteStationRequirement(target.dataset.req, target.dataset.id);
  if (action === 'clone-station-req') cloneStationRequirement(target.dataset.req, target.dataset.id);
  if (action === 'schedule-view') { scheduleView = target.dataset.view; render(); }
  if (action === 'schedule-day') { selectedScheduleDay = target.dataset.day; recommendationContext = null; replacementContext = null; render(); }
  if (action === 'req-day') { selectedRequirementDay = target.dataset.day; render(); }
  if (action === 'export-roster-csv') exportRosterCsv();
  if (action === 'print-confirmed-roster') window.print();
  if (action === 'show-recommend') { recommendationContext = { reqId: target.dataset.req, sreqId: target.dataset.sreq, slotIndex: Number(target.dataset.slot) }; replacementContext = null; render(); }
  if (action === 'show-replace') { replacementContext = { reqId: target.dataset.req, sreqId: target.dataset.sreq, slotIndex: Number(target.dataset.slot) }; recommendationContext = null; render(); }
  if (action === 'close-panels') { recommendationContext = null; replacementContext = null; render(); }
  if (action === 'apply-recommend') { state.schedule[target.dataset.key] = target.dataset.emp; saveState(false); recommendationContext = null; replacementContext = null; render(); toast(t('messages.scheduled')); }
  if (action === 'copy-feedback-email') { copyToClipboard(state.settings.feedbackEmail || ''); }
  if (action === 'copy-feedback-link') { copyToClipboard(normalizeExternalUrl(state.settings.feedbackUrl) || ''); }
}

function handleChange(e) {
  const el = e.target;
  const action = el.dataset.action;
  if (el.dataset.setting) {
    if (el.dataset.setting === 'language') {
      setLanguage(el.value);
      return;
    }
    if (el.type === 'number' || el.dataset.settingType === 'number') {
      state.settings[el.dataset.setting] = num(el.value);
    } else {
      state.settings[el.dataset.setting] = el.value;
    }
    saveState(false);
    render();
    return;
  }
  if (action === 'member-part-filter') {
    selectedMemberPart = el.value || 'all';
    render();
    return;
  }
  if (action === 'new-skill-part') {
    refreshNewSkillStationControl();
    return;
  }
  if (action === 'member-skill-part') {
    refreshMemberStationControl(el.dataset.emp);
    return;
  }
  if (action === 'member-skill-station') {
    refreshMemberSkillControls(el.dataset.emp);
    return;
  }
  if (action === 'member-skill-select') {
    refreshMemberLevelControl(el.dataset.emp);
    return;
  }
  if (action === 'member-level-select') {
    refreshMemberStepControl(el.dataset.emp);
    return;
  }
  if (action === 'req-part-select') {
    refreshRequirementStationControl(el.dataset.req);
    return;
  }
  if (action === 'assign-schedule') {
    if (el.value) state.schedule[el.dataset.key] = el.value;
    else delete state.schedule[el.dataset.key];
    saveState(false);
    render();
    return;
  }
  if (action?.startsWith('availability')) {
    const emp = byId(state.employees, el.dataset.emp);
    if (!emp) return;
    emp.availability = emp.availability || defaultAvailability();
    emp.availability[el.dataset.day] = emp.availability[el.dataset.day] || { available: false, startTime: '10:00', endTime: '22:00' };
    if (action === 'availability-check') emp.availability[el.dataset.day].available = el.checked;
    if (action === 'availability-start') emp.availability[el.dataset.day].startTime = el.value;
    if (action === 'availability-end') emp.availability[el.dataset.day].endTime = el.value;
    saveState(false);
    render();
  }
}

function addPart() {
  const name = document.getElementById('newPartName').value.trim();
  if (!name) return toast(t('messages.partNameRequired'));
  state.parts.push({ id: uid('part'), name, description: document.getElementById('newPartDesc').value.trim(), color: document.getElementById('newPartColor').value, sortOrder: state.parts.length + 1, active: true });
  saveState(false); render(); toast(t('messages.partAdded'));
}
function deletePart(id) {
  if (!confirm(t('messages.partDeleteConfirm'))) return;
  state.parts = state.parts.filter((p) => p.id !== id);
  if (selectedMemberPart === id) selectedMemberPart = 'all';
  saveState(false); render();
}
function addStation() {
  const name = document.getElementById('newStationName').value.trim();
  if (!name) return toast(t('messages.stationNameRequired'));
  const partId = document.getElementById('newStationPart').value;
  if (!partId) return toast(t('messages.partSelectRequired'));
  state.stations.push({ id: uid('st'), partId, name, description: document.getElementById('newStationDesc').value.trim(), requiredSkillIds: [], sortOrder: state.stations.length + 1, active: true });
  saveState(false); render(); toast(t('messages.stationAdded'));
}
function deleteStation(id) {
  if (!confirm(t('messages.stationDeleteConfirm'))) return;
  state.stations = state.stations.filter((s) => s.id !== id);
  saveState(false); render();
}
function createStarterLevelsForSkill(skillId, stationId = '') {
  const base = [
    [1, 1, '기본 개념을 배우는 단계'],
    [1, 2, '반복 업무와 기본 흐름을 일부 수행할 수 있는 단계'],
    [1, 3, '대부분의 흐름을 알고 몇 가지 확인을 통해 업무 가능'],
    [1, 4, 'Level 2 직전 단계. 약간의 어시스트를 제외하면 대부분 수행 가능'],
    [2, 1, '일반 시간대 단독 업무가 가능한 단계'],
    [3, 1, '피크타임 핵심 업무가 가능한 단계'],
    [4, 1, '리더와 교육 담당이 가능한 단계'],
  ];
  return base.map(([levelNumber, stepNumber, description], index) => ({
    id: uid('lvl'),
    skillId,
    levelNumber,
    levelName: `Level ${levelNumber}`,
    stepNumber,
    stepName: `Step ${stepNumber}`,
    description,
    canDo: '',
    cannotDoYet: '',
    canWorkAlone: levelNumber >= 2,
    canWorkPeakTime: levelNumber >= 3,
    needsSupervisor: levelNumber < 2,
    allowedStations: [stationId].filter(Boolean),
    nextPromotionCriteria: '',
    sortOrder: state.levelTemplates.length + index + 1,
  }));
}

function addSkill() {
  const name = document.getElementById('newSkillName').value.trim();
  if (!name) return toast(t('messages.skillNameRequired'));
  const partId = document.getElementById('newSkillPart').value;
  const stationId = document.getElementById('newSkillStation').value;
  if (!partId) return toast(t('messages.partSelectRequired'));
  if (!stationId) return toast(t('messages.stationSelectRequired'));
  const id = uid('sk');
  state.skills.push({ id, name, partId, stationId, category: partName(partId), description: '', isCritical: true, usesLevelStep: true, active: true });
  state.levelTemplates.push(...createStarterLevelsForSkill(id, stationId));
  const station = byId(state.stations, stationId);
  if (station) station.requiredSkillIds = Array.from(new Set([...(station.requiredSkillIds || []), id]));
  selectedSkillId = id;
  saveState(false); render(); toast(t('messages.skillAdded'));
}
function deleteSkill(id) {
  if (!confirm(t('messages.skillDeleteConfirm'))) return;
  state.skills = state.skills.filter((s) => s.id !== id);
  state.levelTemplates = state.levelTemplates.filter((l) => l.skillId !== id);
  state.employees.forEach((emp) => { if (emp.assignedSkills) delete emp.assignedSkills[id]; });
  selectedSkillId = state.skills[0]?.id || '';
  saveState(false); render();
}
function addLevel(skillId = '') {
  const targetSkillId = skillId || selectedSkillId;
  if (!targetSkillId) return;
  const levelNumber = num(document.querySelector(`[data-level-skill="${targetSkillId}"][data-level-field="level"]`)?.value ?? document.getElementById('newLevelNumber')?.value, 1);
  const stepNumber = num(document.querySelector(`[data-level-skill="${targetSkillId}"][data-level-field="step"]`)?.value ?? document.getElementById('newStepNumber')?.value, 1);
  const description = (document.querySelector(`[data-level-skill="${targetSkillId}"][data-level-field="desc"]`)?.value || document.getElementById('newLevelDesc')?.value || '').trim() || '운영자가 설명을 작성하세요.';
  const skill = byId(state.skills, targetSkillId);
  const exists = state.levelTemplates.some((tpl) => tpl.skillId === targetSkillId && Number(tpl.levelNumber) === levelNumber && Number(tpl.stepNumber) === stepNumber);
  if (exists && !confirm(t('messages.levelExistsConfirm'))) return;
  state.levelTemplates.push({
    id: uid('lvl'),
    skillId: targetSkillId,
    levelNumber,
    levelName: `Level ${levelNumber}`,
    stepNumber,
    stepName: `Step ${stepNumber}`,
    description,
    canDo: '',
    cannotDoYet: '',
    canWorkAlone: levelNumber >= 2,
    canWorkPeakTime: levelNumber >= 3,
    needsSupervisor: levelNumber < 2,
    allowedStations: [skill?.stationId].filter(Boolean),
    nextPromotionCriteria: '',
    sortOrder: state.levelTemplates.length + 1
  });
  saveState(false); render(); toast(t('messages.levelAdded'));
}
function deleteLevel(id) {
  state.levelTemplates = state.levelTemplates.filter((l) => l.id !== id);
  saveState(false); render();
}
function addEmployee() {
  const name = document.getElementById('newEmpName').value.trim();
  if (!name) return toast(t('messages.employeeNameRequired'));
  const partId = document.getElementById('newEmpPart').value;
  if (!partId) return toast(t('messages.partSelectRequired'));
  state.employees.push({
    id: uid('emp'), name, partId, role: document.getElementById('newEmpRole').value.trim() || 'Staff', employmentType: 'Casual', baseRate: num(document.getElementById('newEmpRate').value, 28),
    saturdayMultiplier: 1.25, sundayMultiplier: 1.5, publicHolidayMultiplier: 2.25, maxWeeklyHours: num(document.getElementById('newEmpMax').value, 38), preferredWeeklyHours: 0,
    availability: defaultAvailability('10:00', '22:00'), active: true, notes: '', assignedSkills: {}
  });
  saveState(false); render(); toast(t('messages.employeeAdded'));
}
function deleteEmployee(id) {
  if (!confirm(t('messages.employeeDeleteConfirm'))) return;
  state.employees = state.employees.filter((emp) => emp.id !== id);
  Object.keys(state.schedule).forEach((key) => { if (state.schedule[key] === id) delete state.schedule[key]; });
  saveState(false); render();
}
function toggleEmployee(id) {
  const emp = byId(state.employees, id);
  if (!emp) return;
  emp.active = !emp.active;
  saveState(false); render();
}
function refreshNewSkillStationControl() {
  const partSelect = document.getElementById('newSkillPart');
  const stationSelect = document.getElementById('newSkillStation');
  if (!partSelect || !stationSelect) return;
  stationSelect.innerHTML = stationOptions('', partSelect.value, true);
}
function refreshRequirementStationControl(reqId) {
  const partSelect = document.querySelector(`[data-req-field="part"][data-req="${reqId}"]`);
  const stationSelect = document.querySelector(`[data-req-field="station"][data-req="${reqId}"]`);
  if (!partSelect || !stationSelect) return;
  stationSelect.innerHTML = stationOptions('', partSelect.value, true);
}
function refreshMemberStationControl(empId) {
  const partSelect = document.querySelector(`[data-field="memberSkillPart"][data-emp="${empId}"]`);
  const stationSelect = document.querySelector(`[data-field="memberSkillStation"][data-emp="${empId}"]`);
  if (!partSelect || !stationSelect) return;
  const firstStation = firstStationForPart(partSelect.value);
  stationSelect.innerHTML = stationOptions(firstStation, partSelect.value, true);
  stationSelect.value = firstStation;
  refreshMemberSkillControls(empId);
}
function refreshMemberSkillControls(empId) {
  const stationSelect = document.querySelector(`[data-field="memberSkillStation"][data-emp="${empId}"]`);
  const skillSelect = document.querySelector(`[data-field="memberSkillSelect"][data-emp="${empId}"]`);
  if (!stationSelect || !skillSelect) return;
  const firstSkill = firstSkillForStation(stationSelect.value);
  skillSelect.innerHTML = memberSkillSelectOptions(firstSkill, stationSelect.value);
  skillSelect.value = firstSkill;
  refreshMemberLevelControl(empId);
}
function refreshMemberLevelControl(empId) {
  const skillSelect = document.querySelector(`[data-field="memberSkillSelect"][data-emp="${empId}"]`);
  const levelSelect = document.querySelector(`[data-field="memberLevelSelect"][data-emp="${empId}"]`);
  if (!skillSelect || !levelSelect) return;
  const skillId = skillSelect.value;
  const firstLevel = levelsForSkill(skillId)[0] || 1;
  levelSelect.innerHTML = memberLevelOptions(skillId, firstLevel);
  levelSelect.value = String(firstLevel);
  refreshMemberStepControl(empId);
}
function refreshMemberStepControl(empId) {
  const skillSelect = document.querySelector(`[data-field="memberSkillSelect"][data-emp="${empId}"]`);
  const levelSelect = document.querySelector(`[data-field="memberLevelSelect"][data-emp="${empId}"]`);
  const stepSelect = document.querySelector(`[data-field="memberStepSelect"][data-emp="${empId}"]`);
  if (!skillSelect || !levelSelect || !stepSelect) return;
  const skillId = skillSelect.value;
  const level = levelSelect.value || levelsForSkill(skillId)[0] || 1;
  const firstStep = stepsForSkill(skillId, level)[0] || 1;
  stepSelect.innerHTML = memberStepOptions(skillId, level, firstStep);
  stepSelect.value = String(firstStep);
}
function assignSkillToEmployee(empId) {
  const emp = byId(state.employees, empId);
  if (!emp) return;
  const skillSelect = document.querySelector(`[data-field="memberSkillSelect"][data-emp="${empId}"]`);
  const levelSelect = document.querySelector(`[data-field="memberLevelSelect"][data-emp="${empId}"]`);
  const stepSelect = document.querySelector(`[data-field="memberStepSelect"][data-emp="${empId}"]`);
  const skillId = skillSelect?.value;
  const levelRaw = levelSelect?.value;
  const stepRaw = stepSelect?.value;
  if (!skillId) return toast(t('messages.skillSelectRequired'));
  if (!levelRaw) return toast(t('messages.levelSelectRequired'));
  if (!stepRaw) return toast(t('messages.stepSelectRequired'));
  const skill = byId(state.skills, skillId);
  if (!skill) return toast(t('messages.skillNotFound'));
  emp.assignedSkills = emp.assignedSkills || {};
  emp.assignedSkills[skillId] = { level: num(levelRaw), step: num(stepRaw), note: '' };
  saveState(false); render(); toast(t('messages.skillSaved', { skill: skill.name, level: levelRaw, step: stepRaw }));
}
function removeEmployeeSkill(empId, skillId) {
  const emp = byId(state.employees, empId);
  if (!emp?.assignedSkills) return;
  delete emp.assignedSkills[skillId];
  saveState(false); render();
}
function addRequirement() {
  const label = document.getElementById('newReqLabel').value.trim() || 'New Block';
  const dayOfWeek = document.getElementById('newReqDay').value;
  selectedRequirementDay = dayOfWeek;
  state.requirements.push({ id: uid('req'), dayOfWeek, startTime: document.getElementById('newReqStart').value, endTime: document.getElementById('newReqEnd').value, label, minTotalStaff: 0, recommendedTotalStaff: 0, isPeak: document.getElementById('newReqPeak').value === 'true', needsHandover: false, handoverMinutes: 0, notes: '', stationRequirements: [] });
  saveState(false); render(); toast(t('messages.requirementAdded'));
}
function deleteRequirement(id) {
  if (!confirm(t('messages.requirementDeleteConfirm'))) return;
  state.requirements = state.requirements.filter((req) => req.id !== id);
  Object.keys(state.schedule).forEach((key) => { if (parseAssignmentKey(key).reqId === id) delete state.schedule[key]; });
  saveState(false); render();
}
function addStationRequirement(reqId) {
  const req = getReqById(reqId);
  if (!req) return;
  const selectedPart = document.querySelector(`[data-req-field="part"][data-req="${reqId}"]`).value;
  const station = document.querySelector(`[data-req-field="station"][data-req="${reqId}"]`).value;
  if (!station) return toast(t('messages.stationSelectRequired'));
  const part = byId(state.stations, station)?.partId || selectedPart;
  const level = num(document.querySelector(`[data-req-field="level"][data-req="${reqId}"]`).value, 1);
  const step = num(document.querySelector(`[data-req-field="step"][data-req="${reqId}"]`).value, 1);
  const skill = getRequiredSkillId({ stationId: station }) || '';
  req.stationRequirements.push({ id: uid('sreq'), partId: part, stationId: station, requiredSkillId: skill, requiredCount: 1, minLevel: level, minStep: step, needsLeader: false, canUseLowerStepAsEmergency: true });
  req.minTotalStaff = req.stationRequirements.length;
  req.recommendedTotalStaff = req.minTotalStaff;
  saveState(false); render(); toast(t('messages.stationReqAdded'));
}

function cloneStationRequirement(reqId, sreqId) {
  const req = getReqById(reqId);
  const source = req?.stationRequirements.find((r) => r.id === sreqId);
  if (!req || !source) return;
  req.stationRequirements.push({ ...source, id: uid('sreq'), requiredCount: 1 });
  req.minTotalStaff = req.stationRequirements.length;
  req.recommendedTotalStaff = req.minTotalStaff;
  saveState(false); render(); toast(t('messages.stationReqCloned'));
}

function deleteStationRequirement(reqId, sreqId) {
  const req = getReqById(reqId);
  if (!req) return;
  req.stationRequirements = req.stationRequirements.filter((r) => r.id !== sreqId);
  req.minTotalStaff = req.stationRequirements.length;
  req.recommendedTotalStaff = req.minTotalStaff;
  Object.keys(state.schedule).forEach((key) => { const parsed = parseAssignmentKey(key); if (parsed.reqId === reqId && parsed.stationReqId === sreqId) delete state.schedule[key]; });
  saveState(false); render();
}

function exportRosterCsv() {
  const rows = [['Day','Time','Block','Part','Station','Required Skill','Min Level','Min Step','Employee','Status']];
  getRequirementSeatRows().forEach(({ req, sreq, key }) => {
    const status = getAssignmentStatus(req, sreq, key);
    rows.push([
      dayLabel(req.dayOfWeek),
      `${req.startTime}-${req.endTime}`,
      req.label,
      partName(sreq.partId),
      stationName(sreq.stationId),
      requiredSkillName(sreq),
      `Level ${sreq.minLevel}`,
      `Step ${sreq.minStep}`,
      state.schedule[key] ? employeeName(state.schedule[key]) : '',
      status.label,
    ]);
  });
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skillshift-roster.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skillshift-planner-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = mergeState(parsed);
      saveState(false);
      render();
      toast(t('messages.jsonImported'));
    } catch (err) {
      alert(t('messages.invalidJson'));
    }
  };
  reader.readAsText(file);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!['http:', 'https:'].includes(location.protocol)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

function init() {
  document.addEventListener('click', handleClick);
  document.addEventListener('change', handleChange);
  document.getElementById('saveBtn').addEventListener('click', () => saveState(true));
  document.getElementById('resetBtn').addEventListener('click', resetState);
  document.getElementById('exportBtn').addEventListener('click', exportJson);
  document.getElementById('importFile').addEventListener('change', (e) => importJson(e.target.files[0]));
  registerServiceWorker();
  render();
}

init();
