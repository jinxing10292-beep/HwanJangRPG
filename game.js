// 환장 RPG - 솧툌춋의 모험 (전체 스토리 적용)
// 데이터는 game-data.js에서 로드됨

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
    
    // 최종 허용되는 닉네임
    const allowedName = '솧툌춋';
    
    if (nickname === allowedName) {
        resultDiv.innerHTML = '✅ 닉네임 설정 성공!<br>이게 네 이름이구나!';
        setTimeout(() => {
            document.getElementById('nickname-modal').classList.add('hidden');
            showSystemMessage(`${nickname}으로 게임에 접속합니다...`, 'success');
            gameState.player.name = nickname;
            startGame();
        }, 1500);
        return;
    } else {
        resultDiv.innerHTML = '❌ 이미 사용 중인 닉네임입니다!';
    }
    
    setTimeout(() => {
        document.getElementById('nickname-input').value = '';
    }, 500);
}

// Start Game
function startGame() {
    gameState.player.x = 400;
    gameState.player.y = 300;
    gameState.currentScene = '시작의 마을';
    
    // 플레이어 이미지 설정
    const playerSprite = document.querySelector('#player .entity-sprite');
    if (playerSprite) {
        playerSprite.innerHTML = getEntityImage('player', 'player');
    }
    
    loadMap('시작의 마을');
    updateUI();
    setupMovement();
    
    // 업적 체크
    checkAchievement('first_step');
}

// Load Map
function loadMap(mapName) {
    const map = mapData[mapName];
    if (!map) return;
    
    gameState.currentScene = mapName;
    
    // 맵 방문 기록
    gameState.flags.visitedMaps[mapName] = true;
    
    // 맵 배경 적용
    const mapArea = document.getElementById('map-area');
    mapArea.className = 'map-area ' + (map.bgPattern || '');
    
    // 장식 제거 후 추가
    document.querySelectorAll('.decoration').forEach(el => el.remove());
    
    if (map.decorations) {
        map.decorations.forEach((decType, index) => {
            const dec = document.createElement('div');
            dec.className = `decoration ${decType}`;
            
            // 장식 이모지/아이콘
            const decorationIcons = {
                'tree': '🌳',
                'house': '🏠',
                'rock': '🪨',
                'fountain': '⛲',
                'carrot': '🥕',
                'bush': '🌿',
                'flower': '🌸',
                'stream': '',
                'swamp': '💧',
                'dead_tree': '🌑',
                'fog': '',
                'acacia': '🌴',
                'sunset': '🌅',
                'stalactite': '🪨',
                'crystal': '💎',
                'darkness': '',
                'castle': '🏰',
                'coral': '🪸',
                'bubble': '🫧',
                'treasure': '💰',
                'ant_hill': '🐜'
            };
            
            dec.innerHTML = decorationIcons[decType] || '';
            
            // 장식 위치 랜덤 배치
            const positions = [
                { left: '5%', top: '10%' },
                { left: '15%', top: '60%' },
                { left: '25%', top: '25%' },
                { left: '35%', top: '70%' },
                { left: '45%', top: '15%' },
                { left: '55%', top: '65%' },
                { left: '65%', top: '30%' },
                { left: '75%', top: '75%' },
                { left: '85%', top: '20%' },
                { left: '90%', top: '80%' }
            ];
            
            const pos = positions[index % positions.length];
            dec.style.left = pos.left;
            dec.style.top = pos.top;
            
            mapArea.appendChild(dec);
        });
    }
    
    // 현재 맵 표시
    document.getElementById('current-map').textContent = mapName;
    
    // 맵 버튼 상태 업데이트
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.map === mapName) {
            btn.classList.add('active');
        }
        const btnMap = mapData[btn.dataset.map];
        if (btnMap && gameState.player.level < btnMap.minLevel) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    });
    
    // NPC 렌더링
    renderNPCs(map.npcs);
    
    // 몬스터 렌더링
    renderMonsters(map.monsters);
    
    // 플레이어 위치 초기화
    gameState.player.x = 400;
    gameState.player.y = 300;
    updatePlayerPosition();
    
    showSystemMessage(`${mapName} 입장! (${map.description})`, 'success');
    
    // 탐험가 업적 체크
    if (Object.keys(gameState.flags.visitedMaps).length >= 3) {
        checkAchievement('explorer');
    }
}

// Render NPCs
function renderNPCs(npcIds) {
    const container = document.getElementById('npcs-container');
    container.innerHTML = '';
    
    npcIds.forEach((npcId, index) => {
        const npc = npcData[npcId];
        if (!npc) return;
        
        const npcEl = document.createElement('div');
        npcEl.className = 'entity npc';
        npcEl.dataset.npc = npcId;
        npcEl.innerHTML = `
            <div class="entity-sprite">${getEntityImage('npc', npcId)}</div>
            <div class="entity-name">${npc.name}</div>
        `;
        
        npcEl.style.left = `${100 + (index * 120)}px`;
        npcEl.style.top = '200px';
        
        npcEl.addEventListener('click', () => {
            showNPCDialog(npcId);
        });
        
        container.appendChild(npcEl);
    });
}

// Render Monsters
function renderMonsters(monsterIds) {
    const container = document.getElementById('monsters-container');
    container.innerHTML = '';
    
    if (!monsterIds || monsterIds.length === 0) return;
    
    monsterIds.forEach((monsterId, index) => {
        const monster = monsterData[monsterId];
        if (!monster) return;
        
        const monsterEl = document.createElement('div');
        monsterEl.className = 'entity monster spawn-effect';
        monsterEl.dataset.monster = monsterId;
        monsterEl.dataset.hp = monster.hp;
        monsterEl.innerHTML = `
            <div class="entity-sprite">${getEntityImage('monster', monsterId)}</div>
            <div class="entity-name">Lv.${monster.level} ${monsterId}</div>
        `;
        
        const x = 100 + Math.random() * 600;
        const y = 100 + Math.random() * 400;
        monsterEl.style.left = `${x}px`;
        monsterEl.style.top = `${y}px`;
        
        monsterEl.addEventListener('click', () => {
            attackMonster(monsterId, monsterEl);
        });
        
        container.appendChild(monsterEl);
        
        // 몬스터 스폰 알림 (첫 번째 몬스터만)
        if (index === 0) {
            setTimeout(() => {
                showSystemMessage(`⚠️ ${monsterId}가 나타났다! (HP: ${monster.hp})`, 'warning');
            }, 500);
        }
    });
}

// 몬스터 추가 스폰 함수
function spawnAdditionalMonster() {
    const map = mapData[gameState.currentScene];
    if (!map || !map.monsters || map.monsters.length === 0) return;
    
    const monsterId = map.monsters[Math.floor(Math.random() * map.monsters.length)];
    const monster = monsterData[monsterId];
    if (!monster) return;
    
    const container = document.getElementById('monsters-container');
    const monsterEl = document.createElement('div');
    monsterEl.className = 'entity monster spawn-effect';
    monsterEl.dataset.monster = monsterId;
    monsterEl.dataset.hp = monster.hp;
    monsterEl.innerHTML = `
        <div class="entity-sprite">${getEntityImage('monster', monsterId)}</div>
        <div class="entity-name">Lv.${monster.level} ${monsterId}</div>
    `;
    
    const x = 100 + Math.random() * 600;
    const y = 100 + Math.random() * 400;
    monsterEl.style.left = `${x}px`;
    monsterEl.style.top = `${y}px`;
    
    monsterEl.addEventListener('click', () => {
        attackMonster(monsterId, monsterEl);
    });
    
    container.appendChild(monsterEl);
    showSystemMessage(`✨ 새로운 ${monsterId}가 나타났다!`, 'success');
}
}

// Update Player Position
function updatePlayerPosition() {
    const playerEl = document.getElementById('player');
    playerEl.style.left = `${gameState.player.x}px`;
    playerEl.style.top = `${gameState.player.y}px`;
}

// Setup Movement
function setupMovement() {
    document.addEventListener('keydown', (e) => {
        const speed = 10;
        const map = mapData[gameState.currentScene];
        if (!map) return;
        
        switch(e.key) {
            case 'ArrowUp': case 'w': case 'W':
                gameState.player.y = Math.max(50, gameState.player.y - speed);
                break;
            case 'ArrowDown': case 's': case 'S':
                gameState.player.y = Math.min(550, gameState.player.y + speed);
                break;
            case 'ArrowLeft': case 'a': case 'A':
                gameState.player.x = Math.max(50, gameState.player.x - speed);
                break;
            case 'ArrowRight': case 'd': case 'D':
                gameState.player.x = Math.min(750, gameState.player.x + speed);
                break;
        }
        
        updatePlayerPosition();
    });
}

// Show NPC Dialog
function showNPCDialog(npcId) {
    const npc = npcData[npcId];
    if (!npc) return;
    
    // NPC별 특수 대사
    if (npcId === '마을이장') {
        if (!gameState.flags.gotWoodenClub) {
            showDialog(npc.name, "이 강력한 무기를 장착해보게나... 나무몽둥이다!");
            gameState.flags.gotWoodenClub = true;
            gameState.player.weapon = '나무몽둥이';
            addItem('나무몽둥이');
            checkAchievement('get_weapon');
            return;
        }
    }
    
    if (npc.dialog && npc.dialog.length > 0) {
        const randomDialog = npc.dialog[Math.floor(Math.random() * npc.dialog.length)];
        showDialog(npc.name, randomDialog);
    }
}

// Attack Monster
function attackMonster(monsterId, monsterEl) {
    const monster = monsterData[monsterId];
    if (!monster) return;
    
    const damage = 10 + (gameState.player.level * 5);
    let currentHp = parseInt(monsterEl.dataset.hp) || monster.hp;
    currentHp -= damage;
    monsterEl.dataset.hp = currentHp;
    
    showSystemMessage(`${monsterId}에게 ${damage} 데미지! (HP: ${currentHp})`, 'success');
    
    if (currentHp <= 0) {
        monsterEl.remove();
        addExp(monster.exp);
        checkAchievement('first_kill');
        
        if (monster.drops && monster.drops.length > 0) {
            const dropItem = monster.drops[Math.floor(Math.random() * monster.drops.length)];
            addItem(dropItem);
            
            // 수집가 업적 체크
            if (gameState.player.inventory.length >= 10) {
                checkAchievement('collector');
            }
        }
        
        showSystemMessage(`${monsterId} 처치! 경험치 +${monster.exp}`, 'success');
        
        // 몬스터 처치 후 새 몬스터 스폰 (확률적)
        if (Math.random() < 0.3) {
            setTimeout(() => {
                spawnAdditionalMonster();
            }, 2000);
        }
    } else {
        // 피격 효과
        monsterEl.classList.add('hit');
        setTimeout(() => {
            monsterEl.classList.remove('hit');
        }, 200);
    }
}

// 몬스터 수동 스폰 (테스트용)
function manualSpawnMonster() {
    const map = mapData[gameState.currentScene];
    if (!map || !map.monsters || map.monsters.length === 0) {
        showSystemMessage('이 맵에는 몬스터가 없습니다!', 'warning');
        return;
    }
    spawnAdditionalMonster();
}

// Show Dialog
function showDialog(speaker, text) {
    const dialogBox = document.getElementById('dialog-box');
    const dialogText = document.getElementById('dialog-text');
    const dialogOptions = document.getElementById('dialog-options');
    
    dialogBox.classList.remove('hidden');
    dialogText.innerHTML = `<strong>${speaker}:</strong> ${text}`;
    dialogOptions.innerHTML = '';
    
    // NPC별 옵션
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
    } else if (speaker === '잡화상인') {
        addDialogOption('녹용 판매하기', () => sellItem('녹용'));
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
    
    const quest = questData['rabbit_liver_10'];
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
    checkAchievement('learn_skill');
    showDialog('마을이장', `좋은 마음이다! ${skillName}을 배웠구나!`);
}

// Sell Item
function sellItem(itemName) {
    const count = gameState.player.inventory.filter(i => i === itemName).length;
    if (count === 0) {
        showSystemMessage(`${itemName}이(가) 없습니다!`, 'warning');
        return;
    }
    
    // 아이템 제거
    const index = gameState.player.inventory.indexOf(itemName);
    gameState.player.inventory.splice(index, 1);
    
    // 골드 획득 (녹용은 27골드)
    const gold = itemName === '녹용' ? 27 : count * 10;
    addGold(gold);
    
    showSystemMessage(`${itemName}을(를) 팔아 ${gold}골드 획득!`, 'success');
    
    if (itemName === '녹용') {
        gameState.flags.soldAntler = true;
    }
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
    document.getElementById('btn-skill').addEventListener('click', () => showSkillModal());
    document.getElementById('btn-inventory').addEventListener('click', () => showInventoryModal());
    document.getElementById('btn-quest').addEventListener('click', () => showQuestModal());
    document.getElementById('btn-save').addEventListener('click', () => saveGame());
    document.getElementById('btn-spawn').addEventListener('click', () => manualSpawnMonster());
    
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mapName = btn.dataset.map;
            if (btn.disabled) {
                showSystemMessage(`레벨 ${mapData[mapName].minLevel} 이상 필요합니다!`, 'warning');
                return;
            }
            loadMap(mapName);
        });
    });
    
    document.getElementById('btn-close-skill').addEventListener('click', () => {
        document.getElementById('skill-modal').classList.add('hidden');
    });
    document.getElementById('btn-close-inventory').addEventListener('click', () => {
        document.getElementById('inventory-modal').classList.add('hidden');
    });
    document.getElementById('btn-close-quest').addEventListener('click', () => {
        document.getElementById('quest-modal').classList.add('hidden');
    });
    document.getElementById('btn-skill-fusion').addEventListener('click', () => skillFusion());
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
        item.innerHTML = `<span><strong>${skillName}</strong></span><span>MP: ${skill.mp} | ${skill.description || ''}</span>`;
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
    
    // 아이템 그룹화
    const itemCounts = {};
    gameState.player.inventory.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
    });
    
    Object.entries(itemCounts).forEach(([item, count]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.textContent = `${item} x${count}`;
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
    questDiv.innerHTML = `<span><strong>${quest.title}</strong></span><span>${quest.currentCount}/${quest.targetCount}</span>`;
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
    checkAchievement('level_up');
}

// Add Gold
function addGold(amount) {
    gameState.player.gold += amount;
    updateUI();
    
    if (gameState.player.gold >= 10) {
        checkAchievement('first_gold');
    }
}

// Add Item to Inventory
function addItem(item) {
    gameState.player.inventory.push(item);
    showSystemMessage(`${item} 획득!`, 'success');
    updateUI();
}

// Check Achievement
function checkAchievement(achievementId) {
    if (gameState.flags.achievements.includes(achievementId)) return;
    
    const achievement = achievementData[achievementId];
    if (!achievement) return;
    
    gameState.flags.achievements.push(achievementId);
    showSystemMessage(`🏆 업적 달성: ${achievement.name} - ${achievement.description}`, 'success');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);