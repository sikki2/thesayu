/* ============================================================
   생각PT — 창작 스타일 진단 모듈 (diagnosis.js)
   - 사업계획서 2-2 '사고 진단 체계' 구현
   - 프로세스: 안내 → 객관식 10문항(기본7 + 심화3, 심화 가중치 2배)
              → 주관식(선택) → 규칙 기반 분석 → 결과 제공
   - 영역: 연결력(다빈치) / 관찰력(에디슨) / 단순화력(잡스) / 역발상력(다이슨) / 안정 지향
   - 모든 채점은 규칙 기반(LLM 미사용), 기록은 localStorage에만 저장
   - app.js의 전역(mentalModels, openExerciseWorkspace, enterScatterState,
     selectedModelIndex)을 읽기/호출만 하며 app.js 코드는 수정하지 않음
   ============================================================ */

/* ------------------------------------------------------------
   1. 진단 영역 정의 (사업계획서 '사고 영역 분류 체계 (MVP)' 표)
   ------------------------------------------------------------ */
const DIAG_AREAS = {
  conn: {
    key: 'conn',
    name: '연결력',
    typeName: '연결형 창작자',
    thinkerKey: 'creative_davinci',
    thinkerName: '다빈치',
    trait: '서로 다른 분야·사례·개념을 연결하여 새로운 아이디어를 도출하는 능력',
    lensQuestion: '전혀 다른 두 분야를 합치면 무엇이 보일까?'
  },
  obs: {
    key: 'obs',
    name: '관찰력',
    typeName: '관찰형 창작자',
    thinkerKey: 'creative_edison',
    thinkerName: '에디슨',
    trait: '사람의 니즈와 환경적 맥락을 발견하고 해석하는 능력',
    lensQuestion: '작은 차이를 끝까지 파보면 무엇이 나올까?'
  },
  simp: {
    key: 'simp',
    name: '단순화력',
    typeName: '단순화형 창작자',
    thinkerKey: 'creative_jobs',
    thinkerName: '스티브 잡스',
    trait: '복잡한 정보를 핵심 중심으로 구조화하는 능력',
    lensQuestion: '이것에서 뺄 수 있는 가장 중요한 것은?'
  },
  inv: {
    key: 'inv',
    name: '역발상력',
    typeName: '역발상형 창작자',
    thinkerKey: 'creative_dyson',
    thinkerName: '다이슨',
    trait: '기존 전제와 관습을 재해석하여 새로운 가능성을 탐색하는 능력',
    lensQuestion: '당연하다고 여긴 가정을 뒤집으면?'
  },
  stable: {
    key: 'stable',
    name: '안정 지향',
    typeName: '안정 지향형 창작자',
    thinkerKey: null,
    thinkerName: null,
    trait: '검증된 방식과 익숙한 접근을 선호하는 경향',
    lensQuestion: null
  }
};

/* ------------------------------------------------------------
   2. 문항 뱅크 (창의성_시나리오 문서 기반)
   - basic: 기본 문항 풀 14개 (가중치 1)
   - advanced: 심화 분기 문항 풀 6개 (가중치 2)
   - options 순서는 항상 [conn, obs, simp, inv, stable]로 저장하고
     렌더링 시 셔플하여 위치 편향을 제거함
   ------------------------------------------------------------ */
const DIAG_QUESTION_BANK = {
  basic: [
    {
      id: 'b01',
      title: '학습 습관 개선',
      scenario: '내 학습(또는 업무) 습관을 개선하려고 한다. 가장 먼저 할 행동은?',
      options: [
        { area: 'conn', text: '전혀 다른 분야의 방식을 내 습관에 이색적으로 접목한다.' },
        { area: 'obs', text: '나의 실제 생활 패턴을 며칠간 꼼꼼히 기록하고 분석한다.' },
        { area: 'simp', text: '자잘한 계획은 버리고 가장 중요한 핵심 목표 하나만 남긴다.' },
        { area: 'inv', text: '꼭 지금의 방식으로 해야 하는지 습관의 전제 자체를 의심한다.' },
        { area: 'stable', text: '이미 검증된 타인의 우수 사례와 방법론을 그대로 따라 해본다.' }
      ]
    },
    {
      id: 'b02',
      title: '회의가 막혔을 때',
      scenario: '팀 회의 중 아이디어가 고갈되어 막막한 상황이다. 나는?',
      options: [
        { area: 'conn', text: '회의 주제와 무관한 다른 산업이나 분야의 사례를 연결해 본다.' },
        { area: 'obs', text: '팀원들이 무심코 반복하는 말 속에 숨겨진 진짜 의도를 찾는다.' },
        { area: 'simp', text: '논의를 멈추고 우리가 해결해야 할 문제를 단 한 문장으로 줄인다.' },
        { area: 'inv', text: '회의 주제 자체가 처음부터 잘못 설정된 것은 아닌지 뒤집어 본다.' },
        { area: 'stable', text: '지금까지 나온 의견들을 모아 당장 실행 가능한 대안으로 정리한다.' }
      ]
    },
    {
      id: 'b03',
      title: 'AI 답변 활용',
      scenario: '과제를 위해 AI를 썼더니 꽤 그럴듯한 답변이 나왔다. 나의 다음 행동은?',
      options: [
        { area: 'conn', text: '내 독창적인 아이디어와 AI의 답변을 새롭게 융합하여 확장한다.' },
        { area: 'obs', text: 'AI 답변 속에 미세한 논리적 오류나 편향된 패턴이 없는지 파헤친다.' },
        { area: 'simp', text: '복잡하게 제시된 답변 중에서 가장 핵심적인 내용만 짧게 추려낸다.' },
        { area: 'inv', text: '이 답이 나오려면 애초에 어떤 질문을 했어야 했는지 역추적한다.' },
        { area: 'stable', text: '팩트가 완벽하게 검증된 안전하고 확실한 내용만 골라서 활용한다.' }
      ]
    },
    {
      id: 'b04',
      title: '진로 설계',
      scenario: '본격적인 취업 준비나 진로 설계를 시작해야 한다. 나의 전략은?',
      options: [
        { area: 'conn', text: '나의 다양한 관심사를 결합해 남들과 다른 독특한 포트폴리오를 짠다.' },
        { area: 'obs', text: '합격 사례들을 대량으로 모아 공통으로 요구하는 세밀한 패턴을 찾는다.' },
        { area: 'simp', text: '내가 가진 여러 역량 중에서 가장 강력한 무기 단 하나에만 집중한다.' },
        { area: 'inv', text: '취업이라는 기존 경로 대신 1인 창업 등 아예 다른 길의 가능성을 연다.' },
        { area: 'stable', text: '가장 대중적이고 정석으로 알려진 취업 준비 가이드라인을 충실히 따른다.' }
      ]
    },
    {
      id: 'b05',
      title: '카페 공간 기획',
      scenario: '사람들이 자주 찾는 카페 공간을 새롭게 기획한다면?',
      options: [
        { area: 'conn', text: '도서관, 전시관 등 다른 성격의 공간 개념을 카페에 이색적으로 접목한다.' },
        { area: 'obs', text: '사람들의 실제 이동 동선과 머무는 동안의 행동 패턴을 가만히 관찰한다.' },
        { area: 'simp', text: '불필요한 인테리어를 모두 빼고 가장 핵심적인 공간 기능과 구조만 남긴다.' },
        { area: 'inv', text: '음료를 마시는 곳이라는 카페의 당연한 용도와 역할 자체를 파괴해 본다.' },
        { area: 'stable', text: '현재 시장에서 가장 인기 있고 안정적인 프랜차이즈 카페의 구조를 참고한다.' }
      ]
    },
    {
      id: 'b06',
      title: '행사 기획',
      scenario: '소규모 교내 축제나 사내 행사를 기획하게 되었다.',
      options: [
        { area: 'conn', text: '방탈출, 예능 프로그램 등 전혀 다른 포맷을 행사에 결합해 신선함을 준다.' },
        { area: 'obs', text: '과거 사람들의 반응 데이터와 행사 중 불만 사항을 정밀하게 조사한다.' },
        { area: 'simp', text: '자잘한 프로그램을 모두 없애고 가장 반응이 좋을 단 하나에만 올인한다.' },
        { area: 'inv', text: '다 같이 모여 즐긴다는 행사 자체의 기본 형식과 고정관념을 깨버린다.' },
        { area: 'stable', text: '작년에 가장 반응이 좋고 검증되었던 프로그램을 가져와 완성도를 높인다.' }
      ]
    },
    {
      id: 'b07',
      title: '팀 생산성',
      scenario: '우리 팀의 답답한 업무 생산성을 높여야 한다. 어떻게 할까?',
      options: [
        { area: 'conn', text: '스포츠 팀이나 게임 길드 등 다른 조직의 독특한 협업 방식을 가져온다.' },
        { area: 'obs', text: '팀원들의 실제 업무 흐름에서 병목 현상이 생기는 정확한 지점을 찾는다.' },
        { area: 'simp', text: '복잡한 보고 절차나 형식을 없애고 업무 진행 과정을 최소한으로 압축한다.' },
        { area: 'inv', text: '일을 더 잘하는 법 대신, 이 일을 아예 안 하는 법(자동화 등)을 고민한다.' },
        { area: 'stable', text: '기존 프로세스에서 비효율적인 부분을 찾아 조금씩 점진적으로 개선한다.' }
      ]
    },
    {
      id: 'b08',
      title: '새로운 기술 배우기',
      scenario: '코딩, 영상 편집 등 완전히 새로운 기술이나 취미를 배우려고 한다. 나의 접근법은?',
      options: [
        { area: 'conn', text: '내 전공이나 기존에 즐기던 취미를 새롭게 배울 기술에 이색적으로 접목한다.' },
        { area: 'obs', text: '고수들이 작업하는 디테일한 과정과 노하우 영상들을 집요하게 찾아 관찰한다.' },
        { area: 'simp', text: '방대한 이론은 무시하고 당장 써먹을 수 있는 가장 핵심적인 기술 하나만 판다.' },
        { area: 'inv', text: '기초부터 순서대로 배워야 한다는 공식을 깨고 결과물부터 거꾸로 분해한다.' },
        { area: 'stable', text: '가장 유명한 베스트셀러 교재나 1위 인터넷 강의의 커리큘럼을 충실히 따른다.' }
      ]
    },
    {
      id: 'b09',
      title: '마감이 겹쳤을 때',
      scenario: '여러 개의 과제나 업무 마감이 한 번에 겹쳐서 시간이 턱없이 부족하다. 어떻게 할까?',
      options: [
        { area: 'conn', text: '서로 다른 성격의 과제들을 하나의 공통 주제나 포맷으로 묶어 한 번에 해결한다.' },
        { area: 'obs', text: '내 집중력이 언제 가장 높아지는지 시간대별 패턴을 세밀하게 분석하고 기록한다.' },
        { area: 'simp', text: '가장 덜 중요한 과제들은 과감히 포기하고 점수가 높은 핵심 과제 하나에 올인한다.' },
        { area: 'inv', text: '내가 모든 것을 다 해야 한다는 전제를 깨고 타인이나 AI에게 위임한다.' },
        { area: 'stable', text: '기존에 바쁜 일정을 성공적으로 마쳤던 관리 방식을 그대로 가져와 순차적으로 한다.' }
      ]
    },
    {
      id: 'b10',
      title: '발표 슬라이드 제작',
      scenario: '중요한 수업 발표(또는 사내 피칭)를 위한 슬라이드를 제작해야 한다. 나의 전략은?',
      options: [
        { area: 'conn', text: '발표 주제와 전혀 무관한 영화나 소설의 독특한 스토리텔링 방식을 차용해 온다.' },
        { area: 'obs', text: '청중들이 과거 어떤 포인트에서 지루해하고 호응했는지 반응 데이터를 분석한다.' },
        { area: 'simp', text: '화려한 디자인과 부가 설명을 다 빼고 가장 전달하고 싶은 핵심 메시지만 남긴다.' },
        { area: 'inv', text: '발표자가 일방적으로 정보를 전달해야 한다는 프레젠테이션의 고정관념을 뒤집는다.' },
        { area: 'stable', text: '과거에 가장 높은 평가를 받았던 선배들의 템플릿과 우수 사례를 참고하여 만든다.' }
      ]
    },
    {
      id: 'b11',
      title: '여행 의견 조율',
      scenario: '취향이 제각각인 친구들과 함께 여행을 가야 해서 의견 조율이 어렵다. 타개책은?',
      options: [
        { area: 'conn', text: '각자의 이질적인 취향을 독특한 테마(예: 무계획 생존 여행)로 묶어 코스를 짠다.' },
        { area: 'obs', text: '친구들의 평소 성향과 여행 중 불만이 생길 수 있는 미세한 행동 요소를 파악한다.' },
        { area: 'simp', text: '자잘한 일정을 모두 취소하고 모두가 그나마 동의하는 단 한 곳에만 머무른다.' },
        { area: 'inv', text: '다 같이 함께 다녀야 한다는 단체 여행의 당연한 전제를 깨고 각자 다닌다.' },
        { area: 'stable', text: '사람들이 가장 많이 방문하고 리뷰로 검증된 대중적인 여행 코스와 맛집을 선택한다.' }
      ]
    },
    {
      id: 'b12',
      title: '생활비 관리',
      scenario: '매달 돈이 부족해 빠듯한 한 달 예산(생활비)을 관리하고 절약해야 한다.',
      options: [
        { area: 'conn', text: '소비를 통제하는 과정을 게임 퀘스트나 다이어트 등 다른 활동과 결합해 재미를 찾는다.' },
        { area: 'obs', text: '과거 지출 내역과 영수증을 꼼꼼히 살펴보고 돈이 새어나가는 정확한 패턴을 찾는다.' },
        { area: 'simp', text: '복잡한 통장 쪼개기를 포기하고 지출을 줄일 가장 확실한 항목 하나(예: 식비)만 판다.' },
        { area: 'inv', text: '무조건 아껴야 한다는 생각을 뒤집어 오히려 수입을 늘릴 방법을 찾는다.' },
        { area: 'stable', text: '금융 전문가들이 가장 많이 추천하는 표준적인 재테크 방식과 가계부 앱을 활용한다.' }
      ]
    },
    {
      id: 'b13',
      title: '관계 갈등 해결',
      scenario: '동료나 친구와 사소한 오해로 갈등이 생겨 서먹해진 상황을 풀어야 한다.',
      options: [
        { area: 'conn', text: '갈등 상황과 전혀 다른 제3의 공통 관심사를 꺼내어 자연스럽게 관계를 회복한다.' },
        { area: 'obs', text: '상대방의 표정, 뉘앙스, 행동의 미세한 변화를 가만히 복기하여 진짜 불만 원인을 찾는다.' },
        { area: 'simp', text: '복잡한 감정싸움은 접어두고 당장 해결할 핵심 문제 하나만 논의한다.' },
        { area: 'inv', text: '갈등은 빨리 풀어야 한다는 고정관념을 깨고 오히려 치열하게 논쟁해 본다.' },
        { area: 'stable', text: '평소 갈등을 가장 잘 풀었던 사람의 조언이나 대중적인 소통 화법을 따른다.' }
      ]
    },
    {
      id: 'b14',
      title: '나를 보여주는 방식',
      scenario: '내 포트폴리오나 소셜 미디어(SNS)를 사람들에게 더 매력적으로 보이고 싶다.',
      options: [
        { area: 'conn', text: '나와 전혀 무관해 보이는 이질적인 분야의 디자인이나 콘셉트를 내 공간에 끌어온다.' },
        { area: 'obs', text: '사람들이 내 작업물에 언제 오래 머무는지 시간과 클릭 패턴을 정밀하게 분석한다.' },
        { area: 'simp', text: '자잘한 이력을 모두 지우고 나를 가장 강렬하게 보여줄 대표작 하나만 띄운다.' },
        { area: 'inv', text: '성공만 올려야 한다는 공식을 깨고 실패하고 망한 과정들만 업로드한다.' },
        { area: 'stable', text: '내 분야에서 가장 성공한 사람들의 레퍼런스를 그대로 벤치마킹한다.' }
      ]
    }
  ],
  advanced: [
    {
      id: 'a01',
      title: '조별 과제 위기',
      scenario: '방향을 잃고 팀원들의 의욕이 떨어진 조별 과제를 살려야 한다.',
      options: [
        { area: 'conn', text: '게임의 보상 시스템 등 완전히 다른 성격의 방식을 조별 과제에 도입한다.' },
        { area: 'obs', text: '팀원들의 참여도와 대화 내용을 가만히 살펴보고 불만의 진짜 원인을 찾는다.' },
        { area: 'simp', text: '남은 기간 해야 할 과제들을 과감히 쳐내고 단 하나의 핵심 목표만 남긴다.' },
        { area: 'inv', text: '꼭 다 같이 모여서 결과물을 내야 하는지 과제 진행 방식 자체를 뒤집는다.' },
        { area: 'stable', text: '과거에 성공적으로 끝났던 다른 팀의 방식을 참고해 계획을 빠르게 수정한다.' }
      ]
    },
    {
      id: 'a02',
      title: '지루해진 루틴',
      scenario: '매일 하던 운동이나 공부 루틴이 지루해졌다. 타개책은?',
      options: [
        { area: 'conn', text: '평소 전혀 관심 없던 이질적인 취미나 활동을 내 루틴에 새롭게 섞어본다.' },
        { area: 'obs', text: '일과를 시간 단위로 기록하며 집중력과 에너지가 떨어지는 패턴을 찾는다.' },
        { area: 'simp', text: '이것저것 하려던 루틴을 다 버리고 가장 효과가 좋았던 행동 하나만 남긴다.' },
        { area: 'inv', text: '아침에 일찍 일어나야 한다는 등 루틴에 대한 강박적인 전제 자체를 버린다.' },
        { area: 'stable', text: '주변에서 가장 많이 추천하고 대중적으로 검증된 루틴 관리 앱을 따라 한다.' }
      ]
    },
    {
      id: 'a03',
      title: '내 방 탈바꿈',
      scenario: '오래되어 낡은 내 방을 새롭게 탈바꿈하려고 한다.',
      options: [
        { area: 'conn', text: '낡은 물건에 최신 IT 기기나 엉뚱한 소품을 매치해 색다른 분위기를 낸다.' },
        { area: 'obs', text: '내가 방에서 주로 어떤 자세로 어디에 오래 머무는지 생활 동선을 관찰한다.' },
        { area: 'simp', text: '가구들을 전부 치우고 오직 수면 등 단 하나의 목적을 위한 방으로 만든다.' },
        { area: 'inv', text: '방은 쉬는 곳이라는 고정관념을 깨고 공간의 용도를 통째로 바꾼다.' },
        { area: 'stable', text: '인테리어 플랫폼에서 내 방과 비슷한 구조의 인기 레퍼런스를 그대로 적용한다.' }
      ]
    },
    {
      id: 'a04',
      title: '치명적 실수 발견',
      scenario: '마감이 코앞인 중요한 프로젝트에서 돌이킬 수 없는 치명적인 실수를 발견했다.',
      options: [
        { area: 'conn', text: '이 실수와 위기 상황 자체를 역이용하여 전혀 다른 새로운 아이디어나 기회로 연결한다.' },
        { area: 'obs', text: '당황하지 않고 오류가 발생한 지점의 데이터와 흐름을 끝까지 파헤쳐 정확한 원인을 찾는다.' },
        { area: 'simp', text: '퀄리티에 대한 미련을 버리고 당장 마감할 수 있는 최소한의 결과물 형태만 살려낸다.' },
        { area: 'inv', text: '데드라인은 무조건 지켜야 한다는 전제를 깨버리고 일정이나 제출 방식을 뒤집는다.' },
        { area: 'stable', text: '매뉴얼에 명시된 위기 대응 프로세스와 과거의 수습 방식을 신속히 따른다.' }
      ]
    },
    {
      id: 'a05',
      title: '계획이 무너졌을 때',
      scenario: '오랫동안 준비하던 시험이나 취업에서 최종 탈락하여 인생 계획이 무너졌다.',
      options: [
        { area: 'conn', text: '내 기존 역량들을 평소 생각지 못했던 새로운 산업이나 이질적인 직무에 접목한다.' },
        { area: 'obs', text: '탈락의 원인과 내 이력서(답안)가 가진 미세한 약점들을 객관적인 데이터로 분석한다.' },
        { area: 'simp', text: '복잡한 고민과 감정을 차단하고, 당장 통제할 수 있는 가장 단순한 행동 하나만 한다.' },
        { area: 'inv', text: '특정 자격이나 취업이 필수라는 당연한 사회적 전제 자체를 밑바닥부터 부숴버린다.' },
        { area: 'stable', text: '실패 원인을 보완하여 가장 정석적인 합격 가이드라인을 따라 다시 차근차근 준비한다.' }
      ]
    },
    {
      id: 'a06',
      title: '방향을 잃었을 때',
      scenario: '번아웃이 오고 내가 진짜로 하고 싶은 일이 무엇인지 인생의 방향성을 잃었다.',
      options: [
        { area: 'conn', text: '평소 내 삶과 전혀 섞일 일 없던 낯선 사람들을 만나며 정체성의 새로운 조합을 찾는다.' },
        { area: 'obs', text: '일상 속에서 에너지가 오르내리는 아주 작은 순간과 감정 변화를 매일 세밀하게 기록한다.' },
        { area: 'simp', text: '타인의 시선이나 연봉 등 부가 조건을 모두 버리고 내게 가장 중요한 가치 하나만 남긴다.' },
        { area: 'inv', text: '누구나 명확한 꿈을 가지고 살아야 한다는 사회의 강박적인 고정관념 자체를 버린다.' },
        { area: 'stable', text: '대중적으로 검증된 심리 테스트나 멘토링 프로그램으로 내 성향을 객관적으로 파악한다.' }
      ]
    }
  ]
};

/* ------------------------------------------------------------
   3. 진단 상태
   ------------------------------------------------------------ */
const DIAG_CONFIG = { basicCount: 7, advancedCount: 3, advancedWeight: 2 };

let diagState = null;

function createDiagState() {
  return {
    screen: 'intro',          // intro | quiz | subjective | analyzing | result
    questions: [],            // 추출된 10문항 (셔플된 옵션 포함)
    currentIndex: 0,
    answers: [],              // { questionId, area, weight }
    subjectiveTopic: '',
    result: null
  };
}

function diagShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawQuestions() {
  const basics = diagShuffle(DIAG_QUESTION_BANK.basic).slice(0, DIAG_CONFIG.basicCount)
    .map(q => ({ ...q, weight: 1, isAdvanced: false }));
  const advs = diagShuffle(DIAG_QUESTION_BANK.advanced).slice(0, DIAG_CONFIG.advancedCount)
    .map(q => ({ ...q, weight: DIAG_CONFIG.advancedWeight, isAdvanced: true }));
  // 기본 7문항 → 심화 3문항 순서로 진행 (사업계획서 프로세스 표 기준)
  return basics.concat(advs).map(q => ({ ...q, shuffledOptions: diagShuffle(q.options) }));
}

/* ------------------------------------------------------------
   4. 규칙 기반 채점 (사업계획서: '영역별 가중치 기반 산출,
      최고점 = 대표 사고 특성, 최저점 = 맞춤 훈련 연계,
      우세 영역 없음 = 안정 지향 분류')
   ------------------------------------------------------------ */
function computeResult(state) {
  const scores = { conn: 0, obs: 0, simp: 0, inv: 0, stable: 0 };
  state.answers.forEach(a => { scores[a.area] += a.weight; });

  const maxPossible = DIAG_CONFIG.basicCount * 1 + DIAG_CONFIG.advancedCount * DIAG_CONFIG.advancedWeight; // 13
  const creativeKeys = ['conn', 'obs', 'simp', 'inv'];
  const sorted = creativeKeys
    .map(k => ({ key: k, score: scores[k] }))
    .sort((x, y) => y.score - x.score);

  const top = sorted[0];
  const second = sorted[1];
  const lowest = sorted[sorted.length - 1];

  // 안정 지향 분류 규칙:
  //  (1) 안정 지향 점수가 창작 영역 최고점 이상이거나
  //  (2) 최고점 창작 영역이 2위와 동률(우세 영역 없음)인 경우
  const isStable = scores.stable >= top.score || top.score === second.score;

  const primaryArea = isStable ? DIAG_AREAS.stable : DIAG_AREAS[top.key];

  // 위인 싱크로율: 영역 점수를 최대 가능 점수 대비 백분율로 환산
  const synchro = sorted.map(s => ({
    area: DIAG_AREAS[s.key],
    score: s.score,
    pct: Math.round((s.score / maxPossible) * 100)
  }));

  // 추천 훈련: 최저점 창작 영역의 위인 렌즈와 연계 (보완 훈련)
  const recommendArea = DIAG_AREAS[lowest.key];

  return {
    date: new Date().toISOString(),
    scores,
    maxPossible,
    primaryArea,
    isStable,
    synchroTop3: synchro.slice(0, 3),
    recommendArea,
    subjectiveTopic: state.subjectiveTopic
  };
}

function saveDiagnosisResult(result) {
  try {
    const KEY = 'thinkpt_diagnosis_history';
    const history = JSON.parse(localStorage.getItem(KEY) || '[]');
    history.unshift(result);
    localStorage.setItem(KEY, JSON.stringify(history.slice(0, 30)));
  } catch (e) { /* 저장 실패 시 무시 (비차단) */ }
}

/* ------------------------------------------------------------
   5. 렌더링
   ------------------------------------------------------------ */
const diagOverlay = document.getElementById('diagnosis-overlay');
const diagBody = document.getElementById('diagnosis-body');
const btnCloseDiagnosis = document.getElementById('btn-close-diagnosis');

function escapeDiagHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderIntro() {
  diagBody.innerHTML = `
    <div class="diag-screen diag-intro">
      <span class="diag-badge">창작 스타일 진단</span>
      <h2 class="diag-title">3분, 내 사고의 현재 위치를 확인하세요</h2>
      <p class="diag-sub">생각PT는 고정된 성향이 아닌 <strong>창작 상황에서의 사고 반응</strong>을 분석합니다.<br>
      객관식 10문항(기본 7 + 심화 3)에 답하면 연결력 · 관찰력 · 단순화력 · 역발상력<br>
      4가지 창작 스타일과 닮은 위인, 추천 훈련 방향을 알려드립니다.</p>
      <ul class="diag-policy">
        <li><i class="fa-solid fa-user-slash"></i> 비로그인 — 회원가입 없이 바로 시작합니다.</li>
        <li><i class="fa-solid fa-lock"></i> 서버 미저장 — 모든 응답과 결과는 이 브라우저에만 저장됩니다.</li>
        <li><i class="fa-solid fa-stopwatch"></i> 소요 시간 약 3분 — 심화 문항(2배 가중치) 3개가 포함됩니다.</li>
      </ul>
      <button class="diag-btn-primary" id="diag-btn-start">진단 시작하기 <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  `;
  document.getElementById('diag-btn-start').addEventListener('click', () => {
    diagState.screen = 'quiz';
    diagState.currentIndex = 0;
    renderQuiz();
  });
}

function renderQuiz() {
  const idx = diagState.currentIndex;
  const q = diagState.questions[idx];
  const total = diagState.questions.length;
  const progressPct = Math.round((idx / total) * 100);

  const optionsMarkup = q.shuffledOptions.map((opt, i) => `
    <button class="diag-option" data-area="${opt.area}">
      <span class="diag-option-num">${i + 1}</span>
      <span class="diag-option-text">${escapeDiagHTML(opt.text)}</span>
    </button>
  `).join('');

  diagBody.innerHTML = `
    <div class="diag-screen diag-quiz">
      <div class="diag-progress-row">
        <span class="diag-progress-label">Q${idx + 1} / ${total}</span>
        ${q.isAdvanced ? '<span class="diag-deep-badge"><i class="fa-solid fa-bolt"></i> 심화 문항 · 가중치 2배</span>' : ''}
      </div>
      <div class="diag-progress-track"><div class="diag-progress-fill" style="width:${progressPct}%"></div></div>
      <h3 class="diag-q-title">${escapeDiagHTML(q.title)}</h3>
      <p class="diag-q-scenario">${escapeDiagHTML(q.scenario)}</p>
      <div class="diag-options">${optionsMarkup}</div>
      ${idx > 0 ? '<button class="diag-btn-ghost" id="diag-btn-prev"><i class="fa-solid fa-arrow-left"></i> 이전 문항</button>' : ''}
    </div>
  `;

  diagBody.querySelectorAll('.diag-option').forEach(btn => {
    btn.addEventListener('click', () => {
      diagState.answers[idx] = { questionId: q.id, area: btn.dataset.area, weight: q.weight };
      if (idx + 1 < total) {
        diagState.currentIndex += 1;
        renderQuiz();
      } else {
        diagState.screen = 'subjective';
        renderSubjective();
      }
    });
  });

  const prevBtn = document.getElementById('diag-btn-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      diagState.currentIndex -= 1;
      renderQuiz();
    });
  }
}

function renderSubjective() {
  diagBody.innerHTML = `
    <div class="diag-screen diag-subjective">
      <span class="diag-badge">마지막 단계 · 선택 입력</span>
      <h3 class="diag-q-title">요즘 가장 만들어 보고 싶은 것은 무엇인가요?</h3>
      <p class="diag-q-scenario">관심 주제나 최근 만든 결과물을 한 줄로 적어주세요.<br>
      입력한 주제는 진단 결과의 추천 훈련 방향에 반영되며, 이 브라우저에만 저장됩니다.</p>
      <textarea class="diag-textarea" id="diag-topic-input" rows="3"
        placeholder="예) 유튜브 채널 콘셉트, 사이드 프로젝트 아이디어, 공모전 기획안..."></textarea>
      <div class="diag-actions">
        <button class="diag-btn-ghost" id="diag-btn-skip">건너뛰기</button>
        <button class="diag-btn-primary" id="diag-btn-analyze">결과 분석하기 <i class="fa-solid fa-wand-magic-sparkles"></i></button>
      </div>
    </div>
  `;

  const goAnalyze = (topic) => {
    diagState.subjectiveTopic = topic;
    diagState.screen = 'analyzing';
    renderAnalyzing();
  };
  document.getElementById('diag-btn-skip').addEventListener('click', () => goAnalyze(''));
  document.getElementById('diag-btn-analyze').addEventListener('click', () => {
    goAnalyze(document.getElementById('diag-topic-input').value.trim());
  });
}

function renderAnalyzing() {
  diagBody.innerHTML = `
    <div class="diag-screen diag-analyzing">
      <div class="diag-spinner"></div>
      <h3 class="diag-q-title">사고 반응을 분석하고 있습니다</h3>
      <p class="diag-q-scenario">응답 패턴을 4가지 창작 스타일 축에 매핑하는 중...</p>
    </div>
  `;
  window.setTimeout(() => {
    diagState.result = computeResult(diagState);
    saveDiagnosisResult(diagState.result);
    diagState.screen = 'result';
    renderResult();
  }, 1400);
}

/* 마인드 인바디 — 4각 다이아몬드 차트 (SVG) */
function buildDiamondChart(scores, maxPossible) {
  const C = 150, R = 110;
  // 축: 상=연결력, 우=관찰력, 하=단순화력, 좌=역발상력
  const axes = [
    { key: 'conn', x: 0, y: -1, lx: 0, ly: -16, anchor: 'middle' },
    { key: 'obs', x: 1, y: 0, lx: 14, ly: 4, anchor: 'start' },
    { key: 'simp', x: 0, y: 1, lx: 0, ly: 24, anchor: 'middle' },
    { key: 'inv', x: -1, y: 0, lx: -14, ly: 4, anchor: 'end' }
  ];
  const pt = (axis, ratio) => `${C + axis.x * R * ratio},${C + axis.y * R * ratio}`;
  const gridLevels = [0.25, 0.5, 0.75, 1].map(r =>
    `<polygon points="${axes.map(a => pt(a, r)).join(' ')}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>`
  ).join('');
  const axisLines = axes.map(a =>
    `<line x1="${C}" y1="${C}" x2="${C + a.x * R}" y2="${C + a.y * R}" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>`
  ).join('');
  const valuePoly = axes.map(a => {
    const ratio = Math.max(scores[a.key] / maxPossible, 0.04);
    return pt(a, ratio);
  }).join(' ');
  const labels = axes.map(a => {
    const area = DIAG_AREAS[a.key];
    return `<text x="${C + a.x * R + a.lx}" y="${C + a.y * R + a.ly}" text-anchor="${a.anchor}"
      class="diag-chart-label">${area.name} <tspan class="diag-chart-score">${scores[a.key]}</tspan></text>`;
  }).join('');
  return `
    <svg class="diag-diamond" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="마인드 인바디 차트">
      ${gridLevels}${axisLines}
      <polygon points="${valuePoly}" class="diag-value-shape"/>
      ${axes.map(a => {
        const ratio = Math.max(scores[a.key] / maxPossible, 0.04);
        const [x, y] = pt(a, ratio).split(',');
        return `<circle cx="${x}" cy="${y}" r="4" class="diag-value-dot"/>`;
      }).join('')}
      ${labels}
    </svg>
  `;
}

function renderResult() {
  const r = diagState.result;
  const primary = r.primaryArea;

  const synchroMarkup = r.synchroTop3.map((s, i) => `
    <div class="diag-synchro-row">
      <span class="diag-synchro-rank">${i + 1}</span>
      <div class="diag-synchro-info">
        <div class="diag-synchro-head">
          <span class="diag-synchro-name">${s.area.thinkerName} <em>· ${s.area.name}</em></span>
          <span class="diag-synchro-pct">${s.pct}%</span>
        </div>
        <div class="diag-synchro-track"><div class="diag-synchro-fill" style="width:${s.pct}%"></div></div>
      </div>
    </div>
  `).join('');

  const recommendTrainable = !!r.recommendArea.thinkerKey;
  const stableNote = r.isStable
    ? `<p class="diag-stable-note"><i class="fa-solid fa-circle-info"></i> 특정 스타일이 우세하게 나타나지 않아 <strong>안정 지향</strong>으로 분류되었습니다.
       검증된 방식을 선호하는 사고 특성으로, 다양한 위인 렌즈 훈련을 통해 사고의 폭을 넓혀보세요.</p>`
    : '';

  diagBody.innerHTML = `
    <div class="diag-screen diag-result">
      <span class="diag-badge">진단 완료 · 마인드 인바디</span>
      <h2 class="diag-title">당신은 <em class="diag-type">${primary.typeName}</em>에 가깝습니다</h2>
      <p class="diag-sub">${escapeDiagHTML(primary.trait)}</p>
      ${stableNote}

      <div class="diag-result-grid">
        <div class="diag-result-card">
          <h4 class="diag-card-title"><i class="fa-solid fa-chart-area"></i> 마인드 인바디</h4>
          ${buildDiamondChart(r.scores, r.maxPossible)}
          <p class="diag-card-foot">이 결과는 고정 성향이 아닌, 창작 사고 상황에서의 <strong>사고 반응 지표</strong>입니다.</p>
        </div>
        <div class="diag-result-card">
          <h4 class="diag-card-title"><i class="fa-solid fa-user-astronaut"></i> 위인 싱크로율 TOP 3</h4>
          <div class="diag-synchro-list">${synchroMarkup}</div>
          <div class="diag-recommend">
            <h5><i class="fa-solid fa-dumbbell"></i> 추천 훈련 방향</h5>
            <p>가장 보완이 필요한 영역은 <strong>${r.recommendArea.name}</strong>입니다.
            ${recommendTrainable
              ? `<strong>${r.recommendArea.thinkerName}</strong>의 렌즈로 단련해 보세요 — “${r.recommendArea.lensQuestion}”`
              : '다양한 위인 렌즈를 직접 골라 사고의 폭을 넓혀보세요.'}
            ${r.subjectiveTopic ? `<br><span class="diag-topic-echo">입력하신 주제 「${escapeDiagHTML(r.subjectiveTopic)}」에 적용해 보면 더욱 효과적입니다.</span>` : ''}</p>
          </div>
        </div>
      </div>

      <div class="diag-actions diag-actions-final">
        ${recommendTrainable
          ? `<button class="diag-btn-primary" id="diag-btn-train">${r.recommendArea.thinkerName} 렌즈로 훈련 시작 <i class="fa-solid fa-arrow-right"></i></button>`
          : ''}
        <button class="diag-btn-ghost" id="diag-btn-browse">위인 직접 선택하기</button>
        <button class="diag-btn-ghost" id="diag-btn-copy"><i class="fa-solid fa-copy"></i> 결과 복사</button>
      </div>
      <p class="diag-saved-note"><i class="fa-solid fa-floppy-disk"></i> 진단 결과가 이 브라우저의 성장 아카이브에 저장되었습니다.</p>
    </div>
  `;

  const btnTrain = document.getElementById('diag-btn-train');
  if (btnTrain) {
    btnTrain.addEventListener('click', () => {
      startRecommendedTraining(r.recommendArea.thinkerKey);
    });
  }
  document.getElementById('diag-btn-browse').addEventListener('click', () => {
    closeDiagnosisOverlay();
    try { enterScatterState(); } catch (e) { /* app.js 미로딩 시 무시 */ }
  });
  document.getElementById('diag-btn-copy').addEventListener('click', (e) => {
    const lines = [
      `[생각PT 창작 스타일 진단]`,
      `대표 스타일: ${primary.typeName}`,
      `마인드 인바디 — 연결력 ${r.scores.conn} · 관찰력 ${r.scores.obs} · 단순화력 ${r.scores.simp} · 역발상력 ${r.scores.inv} (만점 ${r.maxPossible})`,
      `위인 싱크로율 TOP3: ${r.synchroTop3.map(s => `${s.area.thinkerName} ${s.pct}%`).join(', ')}`,
      `추천 훈련: ${r.recommendArea.name}${r.recommendArea.thinkerName ? ` (${r.recommendArea.thinkerName} 렌즈)` : ''}`
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      e.currentTarget && (e.currentTarget.innerHTML = '<i class="fa-solid fa-check"></i> 복사 완료');
    }).catch(() => {});
  });
}

/* ------------------------------------------------------------
   6. 훈련 연계 (진단 → 훈련 성장 루프)
   ------------------------------------------------------------ */
function startRecommendedTraining(thinkerKey) {
  closeDiagnosisOverlay();
  try {
    const model = mentalModels.find(m => m.key === thinkerKey);
    if (model) {
      selectedModelIndex = Number(model.id);
      openExerciseWorkspace(model.id);
      return;
    }
  } catch (e) { /* 전역 미존재 시 아래 폴백 */ }
  try { enterScatterState(); } catch (e) { /* no-op */ }
}

/* ------------------------------------------------------------
   7. 오버레이 열기/닫기 + 전역 노출
   ------------------------------------------------------------ */
function openDiagnosisOverlay() {
  if (!diagOverlay) return;
  diagState = createDiagState();
  diagState.questions = drawQuestions();
  renderIntro();
  diagOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDiagnosisOverlay() {
  if (!diagOverlay) return;
  diagOverlay.classList.remove('open');
  document.body.style.overflow = 'auto';
}

if (btnCloseDiagnosis) {
  btnCloseDiagnosis.addEventListener('click', closeDiagnosisOverlay);
}

window.openDiagnosisOverlay = openDiagnosisOverlay;
