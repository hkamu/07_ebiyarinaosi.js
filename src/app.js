//app.js

var size;

var mylabel;
//背景スクロールで追加した部分
var gameLayer;
var background;
var scrollSpeed = 1;
var score = 0;
var zanki = 4;
//宇宙船で追加した部分　重力
var ship;
var i =0;
var gameGravity = -0.05;
//宇宙船を操作するで追加した部分 エンジンの推進力
var gameThrust = 0.1;
//パーティクル
var emitter;
var audioEngine;



var gameScene = cc.Scene.extend({

  onEnter: function() {
    this._super();

    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);

    /*HPdisp = new HPdisp();
    HPdisp.init();
    this.addChild(HPdisp);*/

    //音楽再生エンジン
    audioEngine = cc.audioEngine;
    //bgm再生
    if (!audioEngine.isMusicPlaying()) {
      audioEngine.playMusic(res.bgm_main, true);

    }
    //ボリューム
    audioEngine.setMusicVolume(audioEngine.getMusicVolume(res.bgm_main) + 0.5);
  },

});


var game = cc.Layer.extend({
  init: function() {
    this._super();
    size = cc.director.getWinSize();
    //BGMと効果音のエンジンを追加

    //宇宙船を操作するで追加したマウスの部分
    cc.eventManager.addListener({
      event: cc.EventListener.MOUSE,
      onMouseDown: function(event) {
        ship.engineOn = true;
        //泳ぐ時のSE
        audioEngine.playEffect(res.se_swim);

      },
      onMouseUp: function(event) {
        ship.engineOn = false;
        audioEngine.stopAllEffects();
      }
    }, this)

    //スクロール速度:scrollSpeed
    background = new ScrollingBG();
    this.addChild(background);

    bgrockup = new ScrollingROCKUP();
    this.addChild(bgrockup);

    bgrockunder = new ScrollingROCKUNDER();
    this.addChild(bgrockunder);

    bgup = new ScrollingUP();
    this.addChild(bgup);

    bgunder = new ScrollingUNDER();
    this.addChild(bgunder);

    ship = new Ship();
    this.addChild(ship);

    zankiText = cc.LabelTTF.create("残機:" +zanki ,"Arial","30",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(zankiText);
    zankiText.setPosition(50,300);

    scoreText = cc.LabelTTF.create("Score:" +score ,"Stencil Std","20",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(scoreText);
    scoreText.setPosition(250,300);

    //scheduleUpdate関数
    this.scheduleUpdate();
    //アイテム・珊瑚の生成で追加
    this.schedule(this.addAsteroid, 0.5);
    this.schedule(this.addSangoUp, 5);
    this.schedule(this.addSangoDown,8);
    //パーティクルの設定
    emitter = cc.ParticleSun.create();
    this.addChild(emitter, 1);
    var myTexture = cc.textureCache.addImage(res.particle_texture);
    emitter.setTexture(myTexture);
    emitter.setStartSize(2);
    emitter.setEndSize(4);

  },
  update: function(dt) {
    //backgroundのscrollメソッドを呼び出す
    background.scroll();
    bgrockup.scroll();
    bgrockunder.scroll();
    bgup.scroll();
    bgunder.scroll();
    ship.updateY();
  },
  //珊瑚上の生成で追加
  addSangoUp: function(event) {
    var sangoUp = new SangoUP();
    this.addChild(sangoUp);
  },
  //珊瑚下の生成で追加
  addSangoDown: function(event) {
    var sangoDown = new SangoDOWN();
    this.addChild(sangoDown);
  },
  //アイテムの生成で追加
  addAsteroid: function(event) {
    var asteroid = new Asteroid();
    this.addChild(asteroid);
  },
  removeAsteroid: function(asteroid) {
    this.removeChild(asteroid);
  },

});

//背景関連
//スクロール移動する背景クラス
var ScrollingBG = cc.Sprite.extend({
  //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
  ctor: function() {
    this._super();
    this.initWithFile(res.background_png);
  },
  //onEnterメソッドはスプライト描画の際に必ず呼ばれる
  onEnter: function() {
    //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
    this.setPosition(size.width, size.height/2);
  },
  scroll: function() {
    //座標を更新する
    this.setPosition(this.getPosition().x - scrollSpeed, this.getPosition().y);
    //画面の端に到達したら反対側の座標にする
    if (this.getPosition().x < 0) {
      this.setPosition(this.getPosition().x + 320, this.getPosition().y);
    }
  }
});

//背景クラス：上岩
var ScrollingROCKUP = cc.Sprite.extend({
  //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
  ctor: function() {
    this._super();
    this.initWithFile(res.uprock_png);
  },
  //onEnterメソッドはスプライト描画の際に必ず呼ばれる
  onEnter: function() {
    //背景画像の描画開始位置
    this.setPosition(size.width, size.height*0.9);
    //this.setPosition(180,160);
  },
  scroll: function() {
    //座標を更新する
    this.setPosition(this.getPosition().x - scrollSpeed *2, this.getPosition().y);
    //画面の端に到達したら反対側の座標にする
    if (this.getPosition().x < 0) {
      this.setPosition(this.getPosition().x + 320, this.getPosition().y);
    }
  }
});

//背景クラス：下岩
var ScrollingROCKUNDER = cc.Sprite.extend({
  //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
  ctor: function() {
    this._super();
    this.initWithFile(res.underrock_png);
  },
  //onEnterメソッドはスプライト描画の際に必ず呼ばれる
  onEnter: function() {
    //背景画像の描画開始位置
    this.setPosition(size.width, 0);
  },
  scroll: function() {
    //座標を更新する
    this.setPosition(this.getPosition().x - scrollSpeed *2, this.getPosition().y);
    //画面の端に到達したら反対側の座標にする
    if (this.getPosition().x < 0) {
      this.setPosition(this.getPosition().x + 320, this.getPosition().y);
    }
  }
});


//背景クラス：上床
var ScrollingUP = cc.Sprite.extend({
  //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
  ctor: function() {
    this._super();
  },
  //onEnterメソッドはスプライト描画の際に必ず呼ばれる
  onEnter: function() {
    //背景画像の描画開始位置
    this.setPosition(size.width, size.height);
  },
  scroll: function() {
    //座標を更新する
    this.setPosition(this.getPosition().x - scrollSpeed *3, this.getPosition().y);
    //画面の端に到達したら反対側の座標にする
    if (this.getPosition().x < 0) {
      this.setPosition(this.getPosition().x + 320, this.getPosition().y);
    }
  }
});

//背景クラス：下床
var ScrollingUNDER = cc.Sprite.extend({
  //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
  ctor: function() {
    this._super();
  },
  //onEnterメソッドはスプライト描画の際に必ず呼ばれる
  onEnter: function() {
    //背景画像の描画開始位置
    this.setPosition(size.width, 0);
  },
  scroll: function() {
    //座標を更新する
    this.setPosition(this.getPosition().x - scrollSpeed *3, this.getPosition().y);
    //画面の端に到達したら反対側の座標にする
    if (this.getPosition().x < 0) {
      this.setPosition(this.getPosition().x + 320, this.getPosition().y);
    }
  }
});

//重力（仮）で落下する　宇宙船　
var Ship = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.shrimp01_png);
    this.ySpeed = 0; //宇宙船の垂直速度
    //宇宙船を操作するで追加した部分
    this.engineOn = false; //カスタム属性追加　宇宙船のエンジンのON OFF
    this.invulnerability = 0; //無敵モード時間　初期値0
  },
  onEnter: function() {
    this.setPosition(60, 160);

  },
  updateY: function() {
    //宇宙船を操作するで追加した部分
    if (this.engineOn) {
      this.ySpeed += gameThrust;
      //ここでパーティクルエフェクトを宇宙船のすぐ後ろに配置している
      emitter.setPosition(this.getPosition().x - 25, this.getPosition().y);
      //泳ぎアニメ
      i+=1;
      if(i==2){this.initWithFile(res.shrimp02_png);}
      if(i==3){this.initWithFile(res.shrimp03_png);}
      if(i==4){this.initWithFile(res.shrimp04_png);}
      if(i==5){i=1}

    } else {
      //エンジンOffのときは画面外に配置
      this.initWithFile(res.shrimp01_png);
      emitter.setPosition(this.getPosition().x - 250, this.getPosition().y);
    }

    //無敵モード中の視覚効果
    if (this.invulnerability > 0) {
      this.invulnerability--;
      this.setOpacity(255 - this.getOpacity());
    }


    this.setPosition(this.getPosition().x, this.getPosition().y + this.ySpeed);
    this.ySpeed += gameGravity;

    //宇宙船が画面外にでたら、リスタートさせる
    if (this.getPosition().y < 0 || this.getPosition().y > 320) {

      restartGame();
    }
  }
});

//
var SangoUP = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.sangoUp);
  },
  onEnter: function() {
    this._super();
    this.setPosition(600, 400);
    //動き(速さ,x,y)
    var moveAction = cc.MoveTo.create(6, new cc.Point(-100,450));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //衝突判定処理
    var shipBoundingBox = ship.getBoundingBox();
    var asteroidBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(shipBoundingBox, asteroidBoundingBox) && ship.invulnerability == 0) {
      gameLayer.removeAsteroid(this); //削除する
      //効果音を再生
      audioEngine.playEffect(res.se_get);
      restartGame();
    }
    //画面外消去処理
    if (this.getPosition().x < -50) {
      gameLayer.removeAsteroid(this)
    }
  }
});


var SangoDOWN = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.sangoDown);
  },
  onEnter: function() {
    this._super();
    this.setPosition(600, -100);
    //動き(速さ,x,y)
    var moveAction = cc.MoveTo.create(6, new cc.Point(-100,-150));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //衝突判定処理
    var shipBoundingBox = ship.getBoundingBox();
    var asteroidBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(shipBoundingBox, asteroidBoundingBox) && ship.invulnerability == 0) {
      gameLayer.removeAsteroid(this); //削除する
      //効果音を再生
      audioEngine.playEffect(res.se_get);
      restartGame();
    }
    //画面外消去処理
    if (this.getPosition().x < -50) {
      gameLayer.removeAsteroid(this)
    }
  }
});

//アイテムクラス
var Asteroid = cc.Sprite.extend({

  ctor: function() {
    this._super();
    this.initWithFile("res/nagoya"+Math.floor(Math.random()*5)+".png");
  },
  onEnter: function() {
    this._super();
    this.setPosition(600, Math.random() * 320);
    var moveAction = cc.MoveTo.create(2.5, new cc.Point(-100, Math.random() * 320));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //衝突を判定する処理
    var shipBoundingBox = ship.getBoundingBox();
    var asteroidBoundingBox = this.getBoundingBox();
    if (cc.rectIntersectsRect(shipBoundingBox, asteroidBoundingBox) && ship.invulnerability == 0) {
      gameLayer.removeAsteroid(this); //アイテムを削除する
      //効果音を再生する
      audioEngine.playEffect(res.se_get);
      //スコアアップ
      score +=50;
      scoreText.setString("Score:"+score);
    }
    //画面の外にでたアイテムを消去する処理
    if (this.getPosition().x < -50) {
      gameLayer.removeAsteroid(this)
    }
  }
});
//HPの画像表示
/*var HPdisp = cc.Layer.extend({
  //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
  init: function() {
    this._super();
    var ebi = cc.Sprite.create(res.zanki_png);　
    ebi.setPosition(30, 300);　
    this.addChild(ebi,0,0);

    var ebi2 = cc.Sprite.create(res.zanki_png);　
    ebi2.setPosition(80, 300);　
    this.addChild(ebi2,0,1);

    var ebi3 = cc.Sprite.create(res.zanki_png);　
    ebi3.setPosition(130, 300);　
    this.addChild(ebi3,0,2);

    var ebi4 = cc.Sprite.create(res.zanki_png);　
    ebi4.setPosition(180, 300);　
    this.addChild(ebi4,0,3);
  }
});*/

//宇宙船を元の位置に戻して、宇宙船の変数を初期化する
function restartGame() {
  audioEngine.playEffect(res.se_miss);

  zanki--;
    zankiText.setString("残機:"+zanki);
      //◆お手付きが0になったらゲームオーバー◆
      if(zanki < 0){
        zanki = 3;
        cc.director.runScene(new GameOverScene());
  }
  /*HP --;
  HPdisp.removeChildByTag(HP);

  if(HP < 0){

    HP = 4;*/
    //BGM終わり
      //audioEngine.stopMusic();
      //audioEngine.stopAllEffects();

    //GameOverScene移行
    //cc.director.runScene(new GameOverScene());
  //}
  ship.ySpeed = 0;
  ship.setPosition(ship.getPosition().x, 160);
  ship.invulnerability = 100;
}
