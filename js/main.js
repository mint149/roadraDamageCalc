/*
各ユニット毎のnコンボ目のダメージ(※各武器ごとではなく、各ユニット・各コンボごとに計算)
= { ( [基礎攻撃力^0.95]
　＋[基礎攻撃力×アサルト系スキル×0.01]
　＋[特化ダメージスキル] )
　×[全力の一撃 : YES＝2 , NO＝1]
　＋[反属性 : YES＝(100＋アキュート系スキル)×基礎攻撃力^0.46 , NO＝0]
　＋[属性補正×(300+エレメント系スキル) ]
　－[敵防御値] }
　×[ (コンボ補正値+チェイン系スキル)×0.01]
　＋[基礎攻撃力×0.01×0～9の自然数]

※基礎攻撃力＝ユニット攻撃力(アサルト系スキルによる増加分は含まない)＋基礎攻撃力上昇スキル

{
	a = ( [基礎攻撃力^0.95]＋[基礎攻撃力×アサルト系スキル×0.01]＋[特化ダメージスキル] )
　a×[全力の一撃 : YES＝2 , NO＝1]
　＋[反属性 : YES＝ b=(100＋アキュート系スキル)×基礎攻撃力^0.46 , NO＝0]
　＋c=[属性補正×(300+エレメント系スキル) ]
　－[敵防御値] }
　×d[ (コンボ補正値+チェイン系スキル)×0.01]
　＋[基礎攻撃力×0.01×0～9の自然数]

*/

var calcedAtk;
var calcedWeak;
var calcedElement;
var calcedChain;

var atk = new Array(6);
var job = new Array(6);
var panels = new Array(8);
var jobPanelNum = new Array(4);
var damagePerUnit = new Array(6);
var damagePerPanel = new Array(16);
var assault = 0;
var damageBairitu = 0;
var assaultNum = 0;
var tokkou = 0;
var zenryoku = 1;
var weak = 0;
var akyuto = 0;
var hosei = 0;
var element = 0;
var defence = 0;
var chain = [100,60,50,40,40,40,40,30,30,30,30,30,30,30,30,30];
var chainhosei = 0;
var rand = 0;
var totalDamage = 0;
var cutIn;
var thunderCutIn;

var damage = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

function calc() {
	//値を取得
	for (var unitNum = 0; unitNum < atk.length; unitNum++) {
		atk[unitNum] = parseInt($("#units").find("input").eq(unitNum).val());
		job[unitNum] = parseInt($("#units").find("select").eq(unitNum).val());
	};
	jobPanelNum = [0,0,0,0];
	for (var panelNum = 0; panelNum < panels.length; panelNum++) {
		panels[panelNum] = parseInt($("#panels").find("select").eq(panelNum).val());
		jobPanelNum[panels[panelNum]] += 1;
	};
	assault = parseInt($("#assault").val());
	assaultNum = parseInt($("#assaultNum").val());
	tokkou = parseInt($("#tokkou").val());

	if($("#zenryoku").is(":checked")){
		zenryoku = 2;
	}else{
		zenryoku = 1;
	}
	if($("#weak").is(":checked")){
		weak = 1;
	}else{
		weak = 0;
	}
	if($("#cutIn").is(":checked")){
		cutIn = true;
	}else{
		cutIn = false;
	}
	if($("#thunderCutIn").is(":checked")){
		thunderCutIn = true;
	}else{
		thunderCutIn = false;
	}
	akyuto = parseInt($("#akyuto").val());
	hosei = parseInt($("#hosei").val());
	element = parseInt($("#element").val());
	defence = parseInt($("#defence").val());
	chainhosei = parseInt($("#chainhosei").val());
	damageBairitu = parseInt($("#damageBairitu").val());
	rand = parseInt($("#rand").val());
	totalDamage = 0;
	damagePerUnit = [0,0,0,0,0,0];
	damagePerPanel = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	//ダメージ計算
	for (var unitNum = 0; unitNum < atk.length; unitNum++) {
		for (var panelNum = 0; panelNum < jobPanelNum[job[unitNum]]; panelNum++) {
			//計算式の各変数を求める
			calcedAtk = Math.pow(atk[unitNum] + assaultNum, 0.95) + atk[unitNum] * assault * 0.01 + tokkou;
			calcedWeak = weak * (100 + akyuto) * Math.pow(atk[unitNum],0.46);
			calcedElement = hosei * (300 + element);
			calcedChain = Math.min(100,(chain[panelNum] + chainhosei)) * 0.01;

			// カットイン攻撃かつ最後のコンボの場合、チェイン補正を100にする
			if (cutIn && ((panelNum + 1) == jobPanelNum[job[unitNum]])) {
				calcedChain = 1;
			};

			// 稲妻カットイン攻撃かつ最後のコンボの場合、チェイン補正を150にする
			if (thunderCutIn && ((panelNum + 1) == jobPanelNum[job[unitNum]])) {
				calcedChain = 1.5;
			};

			// ユニット攻撃力が0の時はユニットが居ないとみなす
			if (atk[unitNum] != 0) {
				//ダメージ計算式に代入
				totalDamage += (calcedAtk * zenryoku + calcedWeak + calcedElement - defence) * calcedChain * (100 + damageBairitu) * 0.01 + atk[unitNum] * 0.01 * rand;
			};
		};
	};

	//結果表示
	$("#damage").text(parseInt(totalDamage));
}