
//操作可能な数字
let patern = [3];
patern[0] = ['6', '8', '9', '+'];//引くと他の数字になる
patern[1] = ['0', '3', '5', '6', '9', '-'];//加えると他の数字になる
patern[2] = ['0', '2', '3', '5', '6', '9'];//1文字の中の入れ替えで他の数字に

//変更できる数字
let sub = { 6: ['5'], 8: ['0', '9', '6'], 9: ['3', '5'], '+': ['-'] };//引いてて変更できる数字
let add = { 0: ['8'], 3: ['9'], 5: ['6', '9'], 6: ['8'], 9: ['8'], '-': ['+'] };//加えて変更できる数字
let mon = { 0: ['6', '9'], 2: ['3'], 3: ['2', '5'], 5: ['3'], 6: ['0', '9'], 9: ['0', '6'] };//1文字の中の入れ替えで変更できる数字
/**/

function quizStart() {
  answer = "";//正解文字列
  puzzl = "";//問題文字列
  wrp.innerHTML = "";//パズル表示領域（id=”wrapper”）を空に
  msg.innerHTML = "マッチ棒を1本だけ移動して正しい式にしてください。数字は下の例に従ってください。";
  document.getElementById("judge").src = "images/chars.png";
  document.getElementById("btn").innerHTML = "判 定";
  document.getElementById("btn").setAttribute('onclick', "restring()");
  let select = document.getElementById("confset").getElementsByTagName('select');
  makeQuiz(select[1].value , select[0].value );//2項　２桁を指定
}

function makeQuiz(k, c) {
  let str = "";//文字列操作用
  let ary = [];////第1引数は式の項数、第2引数は項の最大桁数

  for (let i = 0; i < k; i++) {
    let col = 1;
    for (let n = 0; n < c; n++) {//10のc乗
      col *= 10;
    }
    //2桁の数を得る場合100未満の乱数を作り配列に
    ary.push(Math.ceil(Math.random() * (col - 1)));
  }

  str = "";
  for (let i = 0; i < ary.length - 1; i++) {
    str += (ary[i] + aryrdm(['-', '+']));//文字列に数字に+or-を付けて加える
  }
  str += ary[ary.length - 1];//文字列に最後の数字を加える

  let ans = eval(str);//数式の文字列を計算し答えを出す
  answer = str + '=' + ans;//イコールと答えを文字列につないで正解を完成
  ary = answer.split('');//正解を一文字づつの文字の配列に
  let ch = cget(ary);//マッチ棒を引く事が可能な文字をランダムに回答から選ぶ

  if (ch != null) {
    puzzl = setquiz(ch);//マッチ棒を引く事ができる文字を引数にsetquiz
  } else {
    puzzl = monotype();
  }
  //puzzl文字列が空でないなく、問題が間違っているなら
  if (puzzl != "" && !eval(puzzl.replace('=', '=='))) {
    pzldraw(puzzl);//パズルを描く
    wrp.style.visibility = "visible";
    //console.log(answer);
  } else {
    init();//locationから変えた
  }
}/************************************************************/

//マッチ棒を引いて数字として成立する文字を探しランダムに1文字とそのidを配列にして返す
function cget(ans) {
  let rtn = [];
  //引いて数字として成立する文字をすべて配列rtnに
  for (let i = 0; i < ans.length; i++) {
    switch (ans[i]) {
      case '6':
      case '8':
      case '9':
      case '+':
        rtn.push(ans[i]);
        break;
      default:
        break;
    }
  }

  if (rtn.length > 0) {//文字の配列が空でないなら
    return aryrdm(rtn);//配列からランダムに1つ返す
  } else {
    return null;//マッチ棒を引いて数字として成立する文字が無かった場合nullを返す
  }
}
/*引数はランダムに選ばれた正解文字列中にあるマッチ棒を引く事のできる文字*/
function setquiz(ch) {
  let ans = answer.split('');
  let rtn = "";
  let cary = [];

  //引数と一致した文字全てのインデックスをcaryに入れる
  for (let i = 0; i < ans.length; i++) {
    if (ans[i] == ch) {

      cary.push(i);
    }
  }

  let c = '';
  let n = -1;
  let aary = [];
  if (cary.length > 0) {
    n = aryrdm(cary);//引数と一致した文字をランダムに選びidをnに
    c = ans[n];//idの指す文字をc
    ans[n] = aryrdm(sub[c]);//マッチ棒を引いて変更できる文字をランダムに選び正解の中の文字と入れ替える
    for (let i = 0; i < ans.length; i++) {
      if (i != n) {//前ステップで操作した文字は避ける
        for (let v = 0; v < patern[1].length; v++) {
          //加えると他の数字になる文字と一致したら
          if (ans[i] == patern[1][v]) {
            aary.push(i);//一致する文字のidを配列に
          }
        }
      }
    }

    if (aary.length > 0) {//マッチ棒を加えられる文字が在ったら
      n = aryrdm(aary);//変更する字を選ぶ
      c = aryrdm(add[ans[n]]);//変更すべき文字をランダムに選ぶ
      ans[n] = c;//対象の文字を入れ替える
      for (let i = 0; i < ans.length; i++) {
        rtn += ans[i];//配列を文字列に
      }
    } else {//マッチ棒を加えられる文字が無い場合
      rtn = monotype();//１文字内でマッチ棒の移動が可能な文字をセットする
    }
  } else {
    rtn = monotype();//１文字内でマッチ棒の移動が可能な文字をセットする
  }

  return rtn;
}
/*一文字の中でマッチ棒の移動が可能な文字をセット*/
function monotype() {
  let id;
  let ary = [];
  let ans = answer.split('');//正解文字列を配列ansに
  let rtn = "";//リターンに使う変数を初期化
  for (let i = 0; i < ans.length; i++) {
    for (let n = 0; n < patern[2].length; n++) {//
      if (patern[2][n] == ans[i]) {
        ary.push(i);//patern[2]に一致すればidをaryに追加
      }
    }
  }

  if (ary.length > 0) {//一文字の中でマッチ棒の移動が可能な文字が在れば
    id = aryrdm(ary);//aryの要素のidを１つランダムに選ぶ
    let c = aryrdm(mon[ans[id]]);//変更可能な文字をキーに連想配列の要素をランダムに選ぶ
    ans[id] = c;//正解配列の文字を出題用に入れ替える
    rtn = ary2str(ans);//配列を文字列にしてrtnに
  }
  return rtn;//rtnを返す
}
/*引数の配列を文字列に*/
function ary2str(ary) {
  let rtn = "";
  for (let i = 0; i < ary.length; i++) {
    rtn += ary[i];
  }
  return rtn;
}
/*解列の要素からランダムに一つ返す*/
function aryrdm(ary) {
  return (ary[Math.ceil(Math.random() * ary.length) - 1]);
}
