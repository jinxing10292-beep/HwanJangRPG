// 환장 RPG - 솧툌춋의 모험
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
        nicknameBug: true
    },
    npcs: {},
    monsters: [],
    currentScene: 'village',
    flags: {}
};

// NPC Data
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
            "직업 추천이 뜰 때까지 사냥을 하기 위해 토끼 사냥터로 가게"
        ],
        quests: [
            { id: 'rabbit_liver', title: '토끼 간 10개', description: '마을 밖의 토끼를 잡아 간을 가져다주세요', reward: { exp: 50, gold: 10 } },
            { id: 'deer_meat', title: '사슴 고기 10개', description: '사슴고원에서 사슴을 잡아 고기를 가져다주세요', reward: { exp: 100, gold: 20 } },
            { id: 'deer_antler', title: '사슴 녹용 20개', description: '사슴 녹용을 더 가져다주세요', reward: { exp: 200, gold: 30 } }
        ]
    },
    '토끼공듀': {
        name: '토끼공듀',
        sprite: '🐰',
        level: 38,
        dialog: [
            "질러볼까?",
            "파티에 초대할게!",
            "발음 연습 좀 해야겠어",
            "내가 도와줄게!"
        ]
    },
    '하겐다즈': {
        name: '하겐다즈',
        sprite: '🧙',
        job: '마법사',
        dialog: [
            "마법사의 스킬을 알려주지",
            "마법을 쓰려면 마법연산이 필요해",
            "가장 기초 마법인 파이어볼을 알려주겠네"
        ],
        skills: ['파이어볼']
    },
    '오타크로드': {
        name: '오타크로드',
        sprite: '🥷',
        job: '도적',
        dialog: [
            "도적의 스킬을 알려주지",
            "소매치기 대결을 해볼까?",
            "이쪽 세계에선 정보가 생명이라"
        ],
        skills: ['소매치기']
    },
    '돼지바한입추릅': {
        name: '돼지바 한입 추릅',
        sprite: '🐷',
        job: '전사',
        dialog: [
            "자! 싸워라! 이기면 전사다!",
            "전사의 스킬을 알려주지"
        ],
        skills: ['강타', '실드']
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
    '심연참': { mp: 50, damage: 300, description: '강력한 일격' }
};

// Monster Data
const monsterData = {
    '토끼': { level: 2, hp: 30, damage: 5, exp: 10, drops: ['토끼의 간'] },
    '사슴': { level: 4, hp: 50, damage: 10, exp: 20, drops: ['사슴고기', '녹용', '사냥꾼의 활'] },
    '불곰': { level: 17, hp: 200, damage: 25, exp: 100, drops: ['웅담'] },
    '산적': { level: 7, hp: 60, damage: 15, exp: 30, drops: [] },
    '끼리코': { level: 30, hp: 300, damage: 40, exp: 200, drops: [] }
};

// Quest Data
const questData = {
    'rabbit_liver': {
        title: '토끼 사냥',
        description: '토끼 간 10개 구해오기',
        target: '토끼',
        targetCount: 10,
        currentCount: 0,
        rewards: { exp: 50, gold: 10 }
    },
    'deer_meat': {
        title: '사슴 사냥',
        description: '사슴 고기 10개 구해오기',
        target: '사슴',
        targetCount: 10,
        currentCount: 0,
        rewards: { exp: 100, gold: 20 }
    },
    'deer_antler': {
        title: '녹용 수집',
        description: '사슴 녹용 20개 구해오기',
        target: '녹용',
        targetCount: 20,
        currentCount: 0,
        rewards: { exp: 200, gold: 30 }
    }
};

// Initialize Game
function initGame() {
    showNicknameModal();
    setupEventListeners();
    updateUI();
}

// Show Nickname Modal
function showNicknameModal() {
    const modal = document.getElementById('nickname-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('btn-set-nickname').addEventListener('click', () => {
        const nickname = document.getElementById('nickname-input').value;
        if (nickname.length > 0) {
            testNickname(nickname);
        }
    });
}

// Test Nickname (Nickname Bug System)
function testNickname(nickname) {
    const resultDiv = document.getElementById('nickname-result');
    const bugNames = ['마왕', '천사', '엘프', '라라', '크웩', '탕후루', '명란젓코난', '아안해', '아니이것도있다고'];
    
    if (nickname.length === 2) {
        resultDiv.innerHTML = '❌ 닉네임 설정 실패!<br>두 글자는 안 됩니다!';
        resultDiv.classList.add('nickname-bug');
        setTimeout(() => {
            resultDiv.classList.remove('nickname-bug');
        }, 300);
    } else if (bugNames.includes(nickname)) {
        resultDiv.innerHTML = '❌ 이미 사용 중인 닉네임입니다!';
    } else {
        resultDiv.innerHTML = '✅ 닉네임 설정 성공!<br>하지만...';
        setTimeout(() => {
            resultDiv.innerHTML += '<br>⚠️ 닉네임 버그 발생!<br>NPC들이 이름을 부를 수 없습니다!';
            gameState.player.nicknameBug = true;
            setTimeout(() => {
                document.getElementById('nickname-modal').classList.add('hidden');
                showSystemMessage('솧툌춋으로 게임에 접속합니다...', 'success');
                startGame();
            }, 2000);
        }, 1000);
        return;
    }
    
    setTimeout(() => {
        document.getElementById('nickname-input').value = '';
    }, 500);
}

// Start Game
function startGame() {
    gameState.player.name = '솧툌춋';
    gameState.currentScene = 'village';
    showNPC('마을이장');
    updateUI();
}

// Show NPC
function showNPC(npcId) {
    const npc = npcData[npcId];
    if (!npc) return;
    
    const npcArea = document.getElementById('npc-area');
    npcArea.innerHTML = `
        <div class="sprite">${npc.sprite}</div>
        <div class="name-tag">${npc.name}</div>
    `;
    
    // Position NPC
    npcArea.style.right = '20%';
    npcArea.style.top = '30%';
    
    // Show dialog
    if (npc.dialog && npc.dialog.length > 0) {
        showDialog(npc.name, npc.dialog[0]);
    }
}

// Show Dialog
function showDialog(speaker, text) {
    const dialogBox = document.getElementById('dialog-box');
    const dialogText = document.getElementById('dialog-text');
    const dialogOptions = document.getElementById('dialog-options');
    
    dialogBox.classList.remove('hidden');
    dialogText.innerHTML = `<strong>${speaker}:</strong> ${text}`;
    dialogOptions.innerHTML = '';
    
    // Add options based on speaker
    if (speaker === '마을이장') {
        addDialogOption('퀘스트 받기', () => acceptQuest());
        addDialogOption('스킬 배우기', () => learnSkill());
        addDialogOption('대화 끝내기', () => endDialog());
    } else if (speaker === '하겐다즈') {
        addDialogOption('파이어볼 배우기', () => learnSkill('파이어볼'));
        addDialogOption('대화 끝내기', () => endDialog());
    } else if (speaker === '오타크로드') {
        addDialogOption('소매치기 배우기', () => learnSkill('소매치기'));
        addDialogOption('대화 끝내기', () => endDialog());
    } else {
        addDialogOption('대화 끝내기', () => endDialog());
    }
}

// Add Dialog Option
function addDialogOption(text, callback) {
    const options = document.getElementById('dialog-options');
    const btn = document.createElement('button');
    btn.className = 'dialog-option';
    btn.textContent = text;
    btn.addEventListener('click', callback);
    options.appendChild(btn);
}

// End Dialog
function endDialog() {
    document.getElementById('dialog-box').classList.add('hidden');
}

// Accept Quest
function acceptQuest() {
    if (gameState.player.currentQuest) {
        showSystemMessage('이미 진행 중인 퀘스트가 있습니다!', 'warning');
        return;
    }
    
    const quest = questData['rabbit_liver'];
    gameState.player.currentQuest = { ...quest };
    showSystemMessage(`퀘스트 시작: ${quest.title}`, 'success');
    showDialog('마을이장', '토끼 간을 구해다오. 서두르게나!');
}

// Learn Skill
function learnSkill(skillName) {
    if (!skillName) {
        showDialog('마을이장', '배우고 싶은 스킬이 있나?');
        return;
    }
    
    const skill = skillData[skillName];
    if (!skill) {
        showSystemMessage('알 수 없는 스킬입니다!', 'error');
        return;
    }
    
    if (gameState.player.skills.includes(skillName)) {
        showSystemMessage('이미 배운 스킬입니다!', 'warning');
        return;
    }
    
    gameState.player.skills.push(skillName);
    showSystemMessage(`${skillName} 스킬을 습득했습니다!`, 'success');
    showDialog('마을이장', `좋은 마음이다! ${skillName}을 배웠구나!`);
}

// Skill Fusion
function skillFusion() {
    if (gameState.player.skills.length < 2) {
        showSystemMessage('융합할 스킬이 부족합니다! (최소 2개 필요)', 'warning');
        return;
    }
    
    if (gameState.player.job !== '초초보자') {
        showSystemMessage('스킬 융합은 초초보자 직업만 사용할 수 있습니다!', 'warning');
        return;
    }
    
    // Show skill selection for fusion
    const skillList = document.getElementById('skill-list');
    skillList.innerHTML = '<p>융합할 스킬 2개를 선택하세요 (개발 중)</p>';
    
    showSystemMessage('스킬 융합 시스템 준비 중...', 'warning');
}

// Update UI
function updateUI() {
    const player = gameState.player;
    
    document.getElementById('level').textContent = player.level;
    document.getElementById('job').textContent = player.job;
    document.getElementById('hp').textContent = player.hp;
    document.getElementById('max-hp').textContent = player.maxHp;
    document.getElementById('mp').textContent = player.mp;
    document.getElementById('max-mp').textContent = player.maxMp;
    document.getElementById('exp').textContent = player.exp;
    document.getElementById('max-exp').textContent = player.maxExp;
    document.getElementById('gold').textContent = player.gold;
}

// Show System Message
function showSystemMessage(text, type = 'info') {
    const msgBox = document.getElementById('system-message');
    msgBox.textContent = text;
    msgBox.className = `show ${type}`;
    
    setTimeout(() => {
        msgBox.classList.remove('show');
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Skill Button
    document.getElementById('btn-skill').addEventListener('click', () => {
        showSkillModal();
    });
    
    // Inventory Button
    document.getElementById('btn-inventory').addEventListener('click', () => {
        showInventoryModal();
    });
    
    // Quest Button
    document.getElementById('btn-quest').addEventListener('click', () => {
        showQuestModal();
    });
    
    // Save Button
    document.getElementById('btn-save').addEventListener('click', () => {
        saveGame();
    });
    
    // Close Modals
    document.getElementById('btn-close-skill').addEventListener('click', () => {
        document.getElementById('skill-modal').classList.add('hidden');
    });
    
    document.getElementById('btn-close-inventory').addEventListener('click', () => {
        document.getElementById('inventory-modal').classList.add('hidden');
    });
    
    document.getElementById('btn-close-quest').addEventListener('click', () => {
        document.getElementById('quest-modal').classList.add('hidden');
    });
    
    // Skill Fusion Button
    document.getElementById('btn-skill-fusion').addEventListener('click', () => {
        skillFusion();
    });
}

// Show Skill Modal
function showSkillModal() {
    const modal = document.getElementById('skill-modal');
    const skillList = document.getElementById('skill-list');
    modal.classList.remove('hidden');
    
    skillList.innerHTML = '';
    
    if (gameState.player.skills.length === 0) {
        skillList.innerHTML = '<p>배운 스킬이 없습니다.</p>';
        return;
    }
    
    gameState.player.skills.forEach(skillName => {
        const skill = skillData[skillName];
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <span><strong>${skillName}</strong></span>
            <span>MP: ${skill.mp} | ${skill.description || ''}</span>
        `;
        skillList.appendChild(item);
    });
}

// Show Inventory Modal
function showInventoryModal() {
    const modal = document.getElementById('inventory-modal');
    const inventoryList = document.getElementById('inventory-list');
    modal.classList.remove('hidden');
    
    inventoryList.innerHTML = '';
    
    if (gameState.player.inventory.length === 0) {
        inventoryList.innerHTML = '<p>인벤토리가 비어있습니다.</p>';
        return;
    }
    
    gameState.player.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.textContent = `${item} x${gameState.player.inventory.filter(i => i === item).length}`;
        inventoryList.appendChild(itemDiv);
    });
}

// Show Quest Modal
function showQuestModal() {
    const modal = document.getElementById('quest-modal');
    const questList = document.getElementById('quest-list');
    modal.classList.remove('hidden');
    
    questList.innerHTML = '';
    
    if (!gameState.player.currentQuest) {
        questList.innerHTML = '<p>진행 중인 퀘스트가 없습니다.</p>';
        return;
    }
    
    const quest = gameState.player.currentQuest;
    const questDiv = document.createElement('div');
    questDiv.className = 'quest-item';
    questDiv.innerHTML = `
        <span><strong>${quest.title}</strong></span>
        <span>${quest.currentCount}/${quest.targetCount}</span>
    `;
    questList.appendChild(questDiv);
}

// Save Game
function saveGame() {
    localStorage.setItem('hwanJangRPG', JSON.stringify(gameState));
    showSystemMessage('게임이 저장되었습니다!', 'success');
}

// Load Game
function loadGame() {
    const saved = localStorage.getItem('hwanJangRPG');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(gameState, loaded);
        showSystemMessage('게임을 불러왔습니다!', 'success');
        updateUI();
    }
}

// Add Experience
function addExp(amount) {
    gameState.player.exp += amount;
    
    if (gameState.player.exp >= gameState.player.maxExp) {
        levelUp();
    }
    
    updateUI();
}

// Level Up
function levelUp() {
    gameState.player.level++;
    gameState.player.exp -= gameState.player.maxExp;
    gameState.player.maxExp = Math.floor(gameState.player.maxExp * 1.5);
    gameState.player.maxHp += 20;
    gameState.player.maxMp += 10;
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.mp = gameState.player.maxMp;
    
    showSystemMessage(`레벨 업! 현재 레벨: ${gameState.player.level}`, 'success');
}

// Add Gold
function addGold(amount) {
    gameState.player.gold += amount;
    updateUI();
}

// Add Item to Inventory
function addItem(item) {
    gameState.player.inventory.push(item);
    showSystemMessage(`${item} 획득!`, 'success');
    updateUI();
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);