
//各数字のマッチ棒を置く位置の配列を２次元配列にした
let nums = [12];
nums[0] = [0, 1, 2, 3, 5, 6];
nums[1] = [2, 5];
nums[2] = [1, 2, 3, 4, 6];
nums[3] = [1, 2, 4, 5, 6];
nums[4] = [0, 2, 4, 5];
nums[5] = [0, 1, 4, 5, 6];
nums[6] = [0, 1, 3, 4, 5, 6];
nums[7] = [0, 1, 2, 5];
nums[8] = [0, 1, 2, 3, 4, 5, 6];
nums[9] = [0, 1, 2, 4, 5, 6];
nums[10] = [4, 7];//+
nums[11] = [4];//-

let wrp;
let box;
let equal
let select;
let current;
let msg;

let answer = "";//正解文字列
let puzzl = "";//問題文字列

window.onload = function () {
  //数字を並べるdivのエレメントをwrpに格納
  wrp = document.getElementById("wrapper");
  //boxクラスの最初のエレメントのノードを複製しboxに格納
  box = document.getElementsByClassName("box")[0].cloneNode(true);
  //equalクラスの最初のエレメントのノードを複製しequalに格納
  equal = document.getElementsByClassName("equal")[0].cloneNode(true);
  select = null;//操作対象のDIVエレメントを格納する変数
  current = null;//現在のマッチの移動先エレメント
  msg = document.getElementById("msg");//id=msgのエレメントを変数msgに
  document.addEventListener('keyup', (e) => {
    if (e.key === 'd' || e.key === 'D') {
      alert(answer);
    }
  });
  quizStart();
}


/*パラメータptx(テキスト)をパズルとして描画する*/
function pzldraw(ptx) {
  select = null;//移動元spanエレメントを保存する変数を空に
  current = null;//マッチの移動先のspanエレメントを保存しておく変数を空に

  let v = ptx.split('');//パラメータptxを一文字づつの配列に
  //配列ｖを一文字づつ処理する
  for (let i = 0; i < v.length; i++) {
    if (v[i] == '=') {//配列のi番目が’＝’の場合
      //equalのコピーをwrapperの子要素に加える
      wrp.appendChild(equal.cloneNode(true));
    } else {
      //イコールでない場合boxのコピーをwrapperに加える。
      wrp.appendChild(box.cloneNode(true));
      let cp = chkchar(v[i]);
      if (cp >= 0) {
        //drow（引数１：追加されたbox，引数２：描画すべき文字のnums配列のインデックス　0～11）
        drow(wrp.lastElementChild, cp);
      } else {
        //生成された問題に異常があった場合
        quizStart();
      }
    }
  }
  msg.style.color = "#0ff";
  //msg.style.visibility = "visible";//出題divを表示
}
/*引数に文字を渡すと対応するnums配列のインデックスを返す*/
function chkchar(c) {
  if (!Number.isNaN(parseInt(c))) {//数字の場合は数値に
    return parseInt(c);
  } else {
    if (c == '-') {
      return 11;
    }
    if (c == '+') {
      return 10;
    }
    return -1;//例外の場合
  }
}
/*drow（引数１：描画対象のbox，引数２：描画すべき文字のnums配列のインデックス　0～11）*/
function drow(el, v) {
  let ary = el.getElementsByTagName("span");//el内のspanタグを配列に
  for (let i = 0; i < ary.length; i++) {
    if (nums[v].includes(i)) {//nums[v]にiが含まれていた場合
      ary[i].style.backgroundImage = 'url("images/red.gif")';
      ary[i].addEventListener("click", clkfunc);//マッチ棒がクリックされた場合の関数
    } else {
      ary[i].addEventListener("click", psfunc);//空のspanがクリックされた場合の関数
    }
  }
}
/*パズルを文字列に戻し正誤の判定*/
function restring() {
  let div = wrp.getElementsByTagName("div");//wrapperのdivをすべて配列

  if (select != null && current == null) {//マッチ棒が取っただけの場合の処理
    alert("マッチ棒を何処かに配置してください。\n取り去るだけではいけません。");
    return null;//処理を終わる
  }

  let str = "";
  for (let i = 0; i < div.length; i++) {//diVを全て処理する
    if (div[i].className == "box") {//clssがboxの場合
      str += chkbox(div[i]);//boxエレメントの状態を数値、記号変換し文字列に加える
    }
    if (div[i].className == "equal") {//clssがequalの場合
      str += "==";//文字列に”＝＝”を加える
    }
  }

  let btn = document.getElementById("btn");//画面下のボタンエレメント
  let j = document.getElementById("judge");//画面上のimgエレメント
  j.addEventListener('click', answin);
  msg.style.color = "#000000";//水色の説明文を消す
  /*可能性の無い例外に対する処理を削除*/
  if (eval(str)) {//文字列をjavascriptとして評価しtrueの場合
    j.src = "images/good.png";//画像をgoodに
    removFunc();//クリック処理を消す
    btn.innerHTML = "NEXT";
    //onclickイベントをクイズ生成に
    btn.setAttribute('onclick', "quizStart()");
  } else {
    j.src = "images/bad.png";//画像をbadに
    //マッチ棒の移動は正解になるまで可能    
  }
}

function answin(e) {
  let ary = e.target.src.split('/').pop();
  if (ary === 'bad.png') {
    alert(answer);
  }
}

//クリック処理を無くす
function removFunc() {
  let spn = wrp.getElementsByTagName("span");
  for (let i = 0; i < spn.length; i++) {
    spn[i].removeEventListener("click", clkfunc);
    spn[i].removeEventListener("click", psfunc);
  }
}
//boxエレメントのマッチ棒チェックし対応する文字を返す
function chkbox(d) {
  let spn = d.getElementsByTagName("span");//引数ｄエレメント内のspanを配列に
  let ary = [];//マッチ棒の位置を入れる配列

  for (let i = 0; i < spn.length; i++) {//移動元のマッチ棒以外のマッチ棒のidを配列に
    if (spn[i].style.backgroundImage != "" && spn[i].style.opacity != '0.4') {
      //backgroundImageが設定されてなく描画濃度が操作されていない場合
      ary.push(i);//aryに番号iを追加
    }
  }

  for (let i = 0; i < nums.length; i++) {
    if (String(ary) == String(nums[i])) {//配列aryと配列numsを文字列として比較
      if (i == 10) {//nums[10]と一致したら’＋’を返す
        return '+';
      }
      if (i == 11) {//nums[11]と一致したら’ー’を返す
        return '-';
      }
      return i;//上記以外は0～9が返る
    }
  }
  return ' ';//ここまでの条件に合わないばあいは例外でスペースを返す
}


/*マッチ棒のクリックイベントの関数*/
function clkfunc(e) {
  /*移動元spanが再度クリックされた場合*/
  if (select == e.target) {
    select_clr();//選択されない状態に戻す
    if (current !== null) {//移動されていたばあい
      current_clr();//移動先のbackgroundなど初期化
    }
    return null;//nullを返して処理終了
  }
  /*移動されたspanが再度クリックされた場合*/
  if (current == e.target) {
    current_clr();//backgroundなど初期化
    select_clr();//選択元の表示濃度など初期化
    return null;//nullを返して処理終了
  }
  //移動元spanが選択されていない場合
  if (select == null) {
    e.target.style.opacity = 0.4;//表示濃度を40％
    select = e.target;//選択元変数にクリックされたspanを設定
    return null;//nullを返して処理終了
  }
}
/*選択済みマッチ棒の初期化（選択されない状態に戻す）*/
function select_clr() {
  select.style.opacity = 1;
  select.removeEventListener("click", psfunc);
  select.addEventListener("click", clkfunc);
  select = null;
}
/*移動されたマッチ棒を元に戻す*/
function current_clr() {
  current.style.backgroundImage = "";
  current.removeEventListener("click", clkfunc);
  current.addEventListener("click", psfunc);
  current = null;
}
/*マッチ棒の設定されていないspanのfunction*/
function psfunc(e) {
  if (select != null) {//移動元が設定されている場合
    if (current != null) {//既に移動先が設定されている
      current_clr()//移動先を初期化
    }
    //backgroundImageの設定
    e.target.style.backgroundImage = 'url("images/red.gif")';
    //空spanのfunctionを消す
    e.target.removeEventListener("click", psfunc);
    //マッチ棒spanのfunctionを設定
    e.target.addEventListener("click", clkfunc);
    //移動先をクリックされたspanに設定
    current = e.target;
  }
}