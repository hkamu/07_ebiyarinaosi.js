var res = {
    particle_texture:"res/particle_texture.png",//パーティクル
    particle_plist:"res/particle_texture.json",//パーティクル
    background_png:"res/background.png",
    uprock_png:"res/rock_above.png",
    underrock_png:"res/rock_under.png",
    up_png:"res/ceiling.png",
    under_png:"res/land.png",
    TitleBG_png:"res/sea.png",
    Title_png:"res/Title.png",
    start_png:"res/start.png",
    gameoverBG_png:"res/arashi.png",
    replay_png:"res/replay_button.png",
    //zanki_png:"res/zanki.png",

    //エビ
    shrimp01_png:"res/shrimp01.png",
    shrimp02_png:"res/shrimp02.png",
    shrimp03_png:"res/shrimp03.png",
    shrimp04_png:"res/shrimp04.png",

    //珊瑚
    sangoUp:"res/coral_above.png",
    sangoDown:"res/coral_under.png",

    //音楽
    bgm_title:"res/bgm_battle01_fadeout.mp3",
    bgm_main:"res/bgm_sirosango.mp3",
    se_swim:"res/se_swim.mp3",
    se_get:"res/se_kettei.mp3",
    se_miss:"res/se_miss.mp3",
    se_death:"res/se_gameover.mp3",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
