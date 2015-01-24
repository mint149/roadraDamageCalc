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
*/

var atk = new Array(6);
var job = new Array(6);
var damagePerUnit = new Array(6);
var damagePerPanel = new Array(16);
var assault = 0;
var assaultNum = 0;
var tokkou = 3000;
var zenryoku = 1;
var weak = 0;
var akyuto = 0;
var hosei = 70;
var element = 0;
var defence = 0;
var chain = [100,60,50,40,40,40,40,30,30,30,30,30,30,30,30,30];
var chainhosei = 0;
var rand = 0;
var totalDamage = 0;
var panel = [0,0,0,0];

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
	for (var panelNum = 0; panelNum < panel.length; panelNum++) {
		panel[panelNum] = parseInt($("#panels").find("select").eq(panelNum).val());
	};
	assault = parseInt($("#assault").val());
	assaultNum = parseInt($("#assaultNum").val());
	tokkou = parseInt($("#tokkou").val());
	zenryoku = parseInt($("#zenryoku").val());
	weak = parseInt($("#weak").val());
	akyuto = parseInt($("#akyuto").val());
	hosei = parseInt($("#hosei").val());
	element = parseInt($("#element").val());
	defence = parseInt($("#defence").val());
	chainhosei = parseInt($("#chainhosei").val());
	rand = parseInt($("#rand").val());
	totalDamage = 0;
	damagePerUnit = [0,0,0,0,0,0];
	damagePerPanel = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	//16パネル(8パネル*ツイン分)のダメージ計算
	for (var unitNum = 0; unitNum < atk.length; unitNum++) {
		for (var chainNum = 0; chainNum < chain.length; chainNum++) {
			if (atk[unitNum] == 0) {
				damage[unitNum][chainNum] = 0;
			}else{
				damage[unitNum][chainNum] = ((Math.pow(atk[unitNum],0.95)
				 + atk[unitNum] * assault * 0.01
				 + tokkou)
				* zenryoku
				+ weak * (100 + akyuto) * Math.pow(atk[unitNum],0.46)
				+ hosei * (300 + element)
				- defence)
				* Math.min(100,(chain[chainNum] + chainhosei)) * 0.01
				+ atk[unitNum] * 0.01 * rand;
			};
			damagePerUnit[unitNum] += damage[unitNum][chainNum];
			damagePerPanel[chainNum] += damage[unitNum][chainNum];
		};
	};

	//表に結果表示
	for (var i = 0; i < atk.length; i++) {
		for (var j = 0; j < chain.length; j++) {
			$("#damageTable").find("tr").eq(i+1).find("td").eq(j+1).text(parseInt(damage[i][j]));
		};
		$("#damageTable").find("tr").eq(i+1).find("td").eq(17).text(parseInt(damagePerUnit[i]));
	};
	for (var i = 0; i < chain.length; i++) {
		$("#damageTable").find("tr").eq(7).find("td").eq(i+1).text(parseInt(damagePerPanel[i]));
	};

	//パネル何枚でどれくらいダメージが出るか表示
	for (var i = 0; i < atk.length; i++) {
		for (var j = 0; j < chain.length; j++) {
			if(j < panel[job[i]]){
				totalDamage += damage[i][j];
				$("#damageTable").find("tr").eq(i+1).find("td").eq(j+1).css("background-color", "#ddddff");
			}else{
				$("#damageTable").find("tr").eq(i+1).find("td").eq(j+1).css("background-color", "#ffffff");
			}
		}
	}
	$("#damage").text(parseInt(totalDamage));
}