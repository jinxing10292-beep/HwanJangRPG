// 환장 RPG - 전체 스토리 데이터 (NPC, 퀘스트, 업적, 스킬, 몬스터)

// Game State
const gameState = {
    player: {
        name: '솧툌춋',
        level: 1,
        job: '초보자',
        hiddenJob: null,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        exp: 0,
        maxExp: 100,
        gold: 0,
        skills: [],
        inventory: [],
        completedQuests: [],
        currentQuest: null,
        pkCount: 0,
        nicknameBug: true,
        x: 400,
        y: 300,
        weapon: null
    },
    npcs: {},
    monsters: [],
    currentScene: '시작의 마을',
    flags: {
        talkedToMayor: false,
        gotWoodenClub: false,
        attackedMayor: false,
        soldAntler: false,
        visitedMaps: {},
        achievements: []
    }
};

// Map Data (전체 스토리 맵)
const mapData = {
    '시작의 마을': {
        name: '시작의 마을',
        minLevel: 1,
        bgColor: '#4a7c59',
        bgPattern: 'grass',
        npcs: ['마을이장', '명란젓코난', '크웩', '잡화상인', '장비상인'],
        monsters: [],
        width: 800,
        height: 600,
        description: '새로운 모험이 시작되는 곳',
        decorations: ['house', 'tree', 'tree', 'fountain']
    },
    '개미밭': {
        name: '개미밭',
        minLevel: 1,
        bgColor: '#8b6914',
        bgPattern: 'dirt',
        npcs: [],
        monsters: ['개미'],
        width: 800,
        height: 600,
        description: '입문용 사냥터, 초보용 필드',
        decorations: ['ant_hill', 'rock', 'rock']
    },
    '토끼밭': {
        name: '토끼밭',
        minLevel: 3,
        bgColor: '#90EE90',
        bgPattern: 'grass',
        npcs: [],
        monsters: ['토끼'],
        width: 800,
        height: 600,
        description: '초반 인기 사냥터. 토끼 몬스터가 등장',
        decorations: ['carrot', 'tree', 'bush', 'flower']
    },
    '사슴고원': {
        name: '사슴고원',
        minLevel: 7,
        bgColor: '#228B22',
        bgPattern: 'meadow',
        npcs: [],
        monsters: ['사슴'],
        width: 800,
        height: 600,
        description: '사슴류 몬스터 출현. 초반 사냥터 중 하나',
        decorations: ['tree', 'tree', 'rock', 'stream']
    },
    '뱀 사냥터': {
        name: '뱀 사냥터',
        minLevel: 15,
        bgColor: '#2F4F4F',
        bgPattern: 'swamp',
        npcs: [],
        monsters: ['뱀'],
        width: 800,
        height: 600,
        description: '뱀 계열 몬스터가 등장',
        decorations: ['swamp', 'rock', 'dead_tree', 'fog']
    },
    '사자 사냥터': {
        name: '사자 사냥터',
        minLevel: 25,
        bgColor: '#CD853F',
        bgPattern: 'savanna',
        npcs: [],
        monsters: ['사자'],
        width: 800,
        height: 600,
        description: '사자류 몬스터가 등장',
        decorations: ['acacia', 'rock', 'sunset', 'grass']
    },
    '동굴': {
        name: '동굴',
        minLevel: 30,
        bgColor: '#1a1a1a',
        bgPattern: 'cave',
        npcs: [],
        monsters: ['동굴박쥐', '좀비'],
        width: 800,
        height: 600,
        description: '동굴형 필드, 적 밀도 ↑',
        decorations: ['stalactite', 'rock', 'crystal', 'darkness']
    },
    '웅장한 용궁': {
        name: '웅장한 용궁',
        minLevel: 100,
        bgColor: '#1e3a5f',
        bgPattern: 'underwater',
        npcs: ['용왕', '인어공주', '조스바르후작'],
        monsters: ['용'],
        width: 800,
        height: 600,
        description: '용 계열 고레벨 필드',
        decorations: ['castle', 'coral', 'bubble', 'treasure']
    }
};

// NPC Data (전체 스토리 NPC)
const npcData = {
    '마을이장': {
        name: '마을이장',
        sprite: '👴',
        dialog: [
            "반갑네 낮선 이여..",
            "이 강력한 무기를 장착해보게나...",
            "장착했으면 휘둘러서 공격 해보게!",
            "5레벨이 됐으니 이제 슬슬 직업을 정할 때가 됐군...",
            "히든직업을 얻을려 하다 전직하지 않은 사람이 수두룩 하네",
            "직업 추천이 뜰 때까지 사냥을 하기 위해 토끼 사냥터로 가게",
            "토끼 간 10개 구해다오. 서두르게나!",
            "사슴 고기 10개 구해와라",
            "사슴 녹용 20개 더 가져다줘",
            "용왕도 탐낸다는 토끼 간이지..."
        ],
        quests: [
            { id: 'rabbit_liver_10', title: '토끼 간 10개', reward: { exp: 50, gold: 10 } },
            { id: 'deer_meat_10', title: '사슴 고기 10개', reward: { exp: 100, gold: 20 } },
            { id: 'deer_antler_20', title: '사슴 녹용 20개', reward: { exp: 200, gold: 30 } }
        ]
    },
    '명란젓코난': {
        name: '명란젓코난',
        sprite: '🧑',
        level: 6,
        dialog: ["아이디가 저게 뭐야...", "이름이 왜 이렇게 복잡해"]
    },
    '크웩': {
        name: '크웩',
        sprite: '🧑',
        level: 2,
        dialog: ["나는 크웩이야!", "토끼 잡는 거 도와줄까?"]
    },
    '잡화상인': {
        name: '잡화상인',
        sprite: '🧔',
        dialog: ["물건 사려구?", "녹용을 팔 거면 내가 사주지"],
        buyItems: ['녹용']
    },
    '장비상인': {
        name: '장비상인',
        sprite: '👨‍🔧',
        dialog: ["무기나 방어구 필요해?", "음유시인 장비도 팔아"]
    },
    '토끼공듀': {
        name: '토끼공듀',
        sprite: '🐰',
        level: 38,
        dialog: ["질러볼까?", "파티에 초대할게!", "내가 도와줄게!"]
    },
    '하겐다즈': {
        name: '하겐다즈',
        sprite: '🧙',
        job: '마법사',
        dialog: ["마법사의 스킬을 알려주지", "수포자는 마법을 못 쓰지..."],
        skills: ['파이어볼']
    },
    '팰라나': {
        name: '팰라나',
        sprite: '🧝‍♀️',
        job: '궁수',
        dialog: ["궁수가 되는 방법은 간단해", "어? 왜 화살을 나에게 쏴..."]
    },
    '돼지바한입추릅': {
        name: '돼지바 한입 추릅',
        sprite: '🐷',
        job: '전사',
        dialog: ["자! 싸워라! 이기면 전사다!", "괴수 이기면 전사 될 수 있어"],
        skills: ['강타', '실드']
    },
    '오타크로드': {
        name: '오타크로드',
        sprite: '🥷',
        job: '도적',
        dialog: ["도적의 스킬을 알려주지", "보이스피싱? 그건 아니지..."],
        skills: ['소매치기']
    },
    '신바드': {
        name: '신바드',
        sprite: '🎸',
        job: '음유시인',
        level: 10,
        dialog: ["기타 칠 줄 알아?", "노래 들려줄까?"]
    },
    '용왕': {
        name: '용왕',
        sprite: '🐲',
        dialog: ["지상인 환영하노라", "메갈로돈을 처치하면 딸을 주마"]
    },
    '인어공주': {
        name: '인어공주',
        sprite: '🧜‍♀️',
        dialog: ["아버님을 도와주세요", "저는 인어공주예요"]
    },
    '조스바르후작': {
        name: '조스바르 후작',
        sprite: '🦈',
        dialog: ["나는 심연의 이빨 페이크 보스", "용왕님께 충성합니다"]
    },
    '가라피카츄': {
        name: '가라피카츄',
        sprite: '🐹',
        job: '테이머',
        dialog: ["내 반려동물 뀨이 사라졌어", "사냥개 뀨이 없어..."]
    },
    '장의사': {
        name: '장의사',
        sprite: '👨‍⚕️',
        job: '의사',
        dialog: ["나는 의사야", "성직자한테 밀려서 일 없네"]
    },
    '국민연금': {
        name: '국민연금',
        sprite: '👴',
        job: '연금술사',
        level: 28,
        dialog: ["나는 연금술사야", "사냥은 못 해", "다른 직업들도 부러워..."]
    },
    '강력핑': {
        name: '강력핑',
        sprite: '🧒',
        level: 45,
        dialog: ["나 8살이야", "숙제하러 가야해"]
    },
    '마린': {
        name: '마린',
        sprite: '🔫',
        level: 50,
        dialog: ["나는 수집가야", "룩용 아이템 모으지"]
    },
    '크로스핑거': {
        name: '크로스핑거',
        sprite: '🎭',
        level: 46,
        dialog: ["물건 한 번 볼래?", "사기치는 거 아니야!"]
    },
    '선량한시민': {
        name: '선량한시민',
        sprite: '😈',
        level: 47,
        dialog: ["나는 선량한 시민이야", "NPC도 죽이고 다녀", "반어법이야 ㅋㅋ"]
    }
};

// Skills Data
const skillData = {
    '연속베기': { mp: 20, damage: 150, description: '마나를 소모하여 연속으로 베기' },
    '파이어볼': { mp: 30, damage: 100, description: '마법 연산을 통해 화염구 발사' },
    '더블샷에로우': { mp: 25, damage: 120, description: '화살을 연달아 두 번 발사' },
    '강타': { mp: 15, damage: 80, description: '강력한 일격' },
    '실드': { mp: 10, description: '방어력 증가' },
    '소매치기': { mp: 0, description: '상대의 아이템을 훔침' },
    '분노': { mp: 30, description: '공격력 10% 증가' },
    '연기하기': { mp: 20, description: '속이는 기술 (성공률 2%)' },
    '심연참': { mp: 50, damage: 300, description: '강력한 일격' },
    '휠윈드': { mp: 40, damage: 80, description: '주변 적들에게 회전 공격' },
    '저지먼트스피어스': { mp: 100, damage: 500, description: '천사의 심판 스킬' },
    '리버전오브그레이스': { mp: 200, description: '상태 이상 회복' },
    '달의무게': { mp: 30, description: '적의 속도 감소' },
    '팬텀피어스': { mp: 45, damage: 250, description: '유령 검으로 찌르기' },
    '스킬융합': { mp: 0, description: '두 스킬을 합쳐 하나 만들기' }
};

// Monster Data
const monsterData = {
    '개미': { level: 1, hp: 20, damage: 3, exp: 5, drops: ['개미다리'] },
    '토끼': { level: 2, hp: 30, damage: 5, exp: 10, drops: ['토끼의 간'] },
    '사슴': { level: 4, hp: 50, damage: 10, exp: 20, drops: ['사슴고기', '녹용', '사냥꾼의 활'] },
    '뱀': { level: 15, hp: 80, damage: 20, exp: 50, drops: ['뱀 가죽'] },
    '사자': { level: 25, hp: 150, damage: 35, exp: 100, drops: ['사자 발톱'] },
    '동굴박쥐': { level: 30, hp: 60, damage: 25, exp: 40, drops: ['박쥐 날개'] },
    '좀비': { level: 32, hp: 100, damage: 30, exp: 60, drops: ['좀비 이빨'] },
    '산적': { level: 7, hp: 60, damage: 15, exp: 30, drops: [] },
    '불곰': { level: 17, hp: 200, damage: 25, exp: 100, drops: ['웅담'] },
    '용': { level: 100, hp: 500, damage: 100, exp: 500, drops: ['용의 비늘'] },
    '메갈로돈': { level: 100, hp: 1000, damage: 150, exp: 1000, drops: ['메갈로돈 이빨'] }
};

// Quest Data
const questData = {
    'rabbit_liver_10': {
        title: '토끼 사냥 (10개)',
        description: '토끼 간 10개 구해오기',
        target: '토끼의 간',
        targetCount: 10,
        currentCount: 0,
        rewards: { exp: 50, gold: 10 },
        npc: '마을이장'
    },
    'deer_meat_10': {
        title: '사슴 사냥 (10개)',
        description: '사슴 고기 10개 구해오기',
        target: '사슴고기',
        targetCount: 10,
        currentCount: 0,
        rewards: { exp: 100, gold: 20 },
        npc: '마을이장'
    },
    'deer_antler_20': {
        title: '녹용 수집 (20개)',
        description: '사슴 녹용 20개 구해오기',
        target: '녹용',
        targetCount: 20,
        currentCount: 0,
        rewards: { exp: 200, gold: 30 },
        npc: '마을이장'
    },
    'bear_gall': {
        title: '웅담 구하기',
        description: '불곰에게서 웅담 구해오기',
        target: '웅담',
        targetCount: 1,
        currentCount: 0,
        rewards: { exp: 150, gold: 50 },
        npc: '나서스'
    }
};

// Achievement Data
const achievementData = {
    'first_step': { name: '첫 걸음', description: '게임에 접속한다' },
    'nickname_master': { name: '닉네임 마스터', description: '솧툌춋이라는 닉네임을 얻는다' },
    'first_kill': { name: '첫 사냥', description: '첫 몬스터를 처치한다' },
    'level_up': { name: '레벨 업', description: '레벨이 오른다' },
    'get_weapon': { name: '무기 획득', description: '첫 무기를 얻는다' },
    'learn_skill': { name: '스킬 습득', description: '첫 스킬을 배운다' },
    'first_gold': { name: '첫 수익', description: '첫 골드를 번다' },
    'quest_complete': { name: '퀘스트 완료', description: '첫 퀘스트를 완료한다' },
    'explorer': { name: '탐험가', description: '3개 이상의 맵을 방문한다' },
    'collector': { name: '수집가', description: '인벤토리에 10개 이상의 아이템을 모은다' }
};

// Export for use in main game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameState, mapData, npcData, skillData, monsterData, questData, achievementData };
}