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

var atk = new Array(4);
var assault = 0;
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
var sum = 0;

var damage = [
	[100,60,50,40,40,40,40,30,30,30,30,30,30,30,30,30],
	[100,60,50,40,40,40,40,30,30,30,30,30,30,30,30,30],
	[100,60,50,40,40,40,40,30,30,30,30,30,30,30,30,30],
	[100,60,50,40,40,40,40,30,30,30,30,30,30,30,30,30]
]

function calc() {
	//値を取得
	atk[0] = parseInt($("#unit1atk").val());
	atk[1] = parseInt($("#unit2atk").val());
	atk[2] = parseInt($("#unit3atk").val());
	atk[3] = parseInt($("#unit4atk").val());
	assault = parseInt($("#assault").val());
	tokkou = parseInt($("#tokkou").val());
	zenryoku = parseInt($("#zenryoku").val());
	weak = parseInt($("#weak").val());
	akyuto = parseInt($("#akyuto").val());
	hosei = parseInt($("#hosei").val());
	element = parseInt($("#element").val());
	defence = parseInt($("#defence").val());
	chainhosei = parseInt($("#chainhosei").val());
	rand = parseInt($("#rand").val());
	sum = 0;

	//16パネル(8パネル*ツイン分)のダメージ計算
	for (var unitNum = 0; unitNum < atk.length; unitNum++) {
		for (var chainNum = 0; chainNum < chain.length; chainNum++) {
			damage[unitNum][chainNum] = ((Math.pow(atk[unitNum],0.95)
			 + atk[unitNum] * assault * 0.01
			 + tokkou)
			* zenryoku
			+ weak * (100 + akyuto) * Math.pow(atk[unitNum],0.46)
			+ hosei * (300 + element)
			- defence)
			* Math.min(100,(chain[chainNum] + chainhosei)) * 0.01
			+ atk[unitNum] * 0.01 * rand;	

			sum += damage[unitNum][chainNum];
		};
	};

	//結果表示
	$("#damage16panel").text("16枚消し時の攻撃力：" + sum);
}