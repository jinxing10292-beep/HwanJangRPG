// 환장 RPG - 이미지 경로 매핑
// 실제 이미지를 사용하려면 해당 경로에 이미지를 추가하세요

const imagePaths = {
    // 플레이어
    'player': 'images/player.png',
    
    // NPC
    '마을이장': 'images/npc/mayor.png',
    '명란젓코난': 'images/npc/myeonganjeot_conan.png',
    '크웩': 'images/npc/kreug.png',
    '잡화상인': 'images/npc/misc_merchant.png',
    '장비상인': 'images/npc/equipment_merchant.png',
    '토끼공듀': 'images/npc/rabbit_gongdu.png',
    '하겐다즈': 'images/npc/hagendaz.png',
    '팰라나': 'images/npc/pelana.png',
    '돼지바한입추릅': 'images/npc/pigba.png',
    '오타크로드': 'images/npc/otak_road.png',
    '신바드': 'images/npc/sinbard.png',
    '용왕': 'images/npc/dragon_king.png',
    '인어공주': 'images/npc/mermaid_princess.png',
    '가라피카츄': 'images/npc/garapicatchu.png',
    '장의사': 'images/npc/funeral_director.png',
    '국민연금': 'images/npc/national_pension.png',
    '강력핑': 'images/npc/gangryeokping.png',
    '마린': 'images/npc/marine.png',
    '크로스핑거': 'images/npc/cross_finger.png',
    '선량한시민': 'images/npc/good_citizen.png',
    
    // 몬스터
    '개미': 'images/monster/ant.png',
    '토끼': 'images/monster/rabbit.png',
    '사슴': 'images/monster/deer.png',
    '뱀': 'images/monster/snake.png',
    '사자': 'images/monster/lion.png',
    '동굴박쥐': 'images/monster/cave_bat.png',
    '좀비': 'images/monster/zombie.png',
    '산적': 'images/monster/bandit.png',
    '산적아내': 'images/monster/bandit_wife.png',
    '주니어산적': 'images/monster/junior_bandit.png',
    '불곰': 'images/monster/fire_bear.png',
    '끼리코': 'images/monster/kkiriko.png',
    '포식버섯': 'images/monster/eating_mushroom.png',
    '용': 'images/monster/dragon.png',
    '메갈로돈': 'images/monster/megalodon.png',
    '욕망의그리드': 'images/monster/greed.png',
    
    // 맵 배경
    '시작의 마을': 'images/map/village.png',
    '개미밭': 'images/map/ant_hill.png',
    '토끼밭': 'images/map/rabbit_field.png',
    '사슴고원': 'images/map/deer_plateau.png',
    '뱀 사냥터': 'images/map/snake_hunting_ground.png',
    '사자 사냥터': 'images/map/lion_hunting_ground.png',
    '동굴': 'images/map/cave.png',
    '웅장한 용궁': 'images/map/dragon_palace.png',
    
    // 아이템
    '나무몽둥이': 'images/item/wooden_club.png',
    '토끼의 간': 'images/item/rabbit_liver.png',
    '사슴고기': 'images/item/deer_meat.png',
    '녹용': 'images/item/deer_antler.png',
    '웅담': 'images/item/bear_gall.png',
    '용의 비늘': 'images/item/dragon_scale.png'
};

// 이모지 폴백 매핑 (이미지가 없을 때 사용)
const emojiFallback = {
    'player': '🧑',
    '마을이장': '👴',
    '명란젓코난': '🧑',
    '크웩': '🧑',
    '잡화상인': '🧔',
    '장비상인': '👨‍🔧',
    '토끼공듀': '🐰',
    '하겐다즈': '🧙',
    '팰라나': '🧝‍♀️',
    '돼지바한입추릅': '🐷',
    '오타크로드': '🥷',
    '신바드': '🎸',
    '용왕': '🐲',
    '인어공주': '🧜‍♀️',
    '가라피카츄': '🐹',
    '장의사': '👨‍⚕️',
    '국민연금': '👴',
    '강력핑': '🧒',
    '마린': '🔫',
    '크로스핑거': '🎭',
    '선량한시민': '😈',
    '개미': '🐜',
    '토끼': '🐰',
    '사슴': '🦌',
    '뱀': '🐍',
    '사자': '🦁',
    '동굴박쥐': '🦇',
    '좀비': '🧟',
    '산적': '👤',
    '불곰': '🐻',
    '용': '🐉',
    '메갈로돈': '🦈'
};

// 이미지 로드 함수
function getEntityImage(entityType, name) {
    const key = name || entityType;
    const imagePath = imagePaths[key];
    
    if (imagePath) {
        return `<img src="${imagePath}" alt="${key}" class="entity-img" onerror="this.style.display='none'; this.parentElement.innerHTML='${emojiFallback[key] || '❓'}';">`;
    }
    
    // 폴백 이모지 반환
    return emojiFallback[key] || '❓';
}

// 플레이어 이미지 업데이트
function updatePlayerImage() {
    const playerSprite = document.querySelector('#player .entity-sprite');
    if (playerSprite) {
        playerSprite.innerHTML = getEntityImage('player', 'player');
    }
}

// NPC 이미지 업데이트
function updateNPCImages() {
    document.querySelectorAll('.npc .entity-sprite').forEach(sprite => {
        const npcName = sprite.parentElement.dataset.npc;
        sprite.innerHTML = getEntityImage('npc', npcName);
    });
}

// 몬스터 이미지 업데이트
function updateMonsterImages() {
    document.querySelectorAll('.monster .entity-sprite').forEach(sprite => {
        const monsterName = sprite.parentElement.dataset.monster;
        sprite.innerHTML = getEntityImage('monster', monsterName);
    });
}

// 모든 엔티티 이미지 업데이트
function updateAllImages() {
    updatePlayerImage();
    updateNPCImages();
    updateMonsterImages();
}