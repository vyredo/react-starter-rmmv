/*:
 * @plugindesc Show a Splash Screen "Made with MV" and/or a Custom Splash Screen before going to main screen.
 * @author vidy
 * todo testing: 1.inheritance using class 2.async await
 *
 *
 * @param Text Param
 * @type text
 * @default Sometext
 *
 * @help This is help
 *
 * @param Number Param
 * @type number
 * @desc My Number
 * @min 0
 * @max 50
 * @decimals 5
 *
 * @param File Param
 * @type file
 * @dir audio/bgm
 * @require 1
 * @desc Pick a song
 */

(function () {
  console.log("params is running");

  const params = PluginManager.parameters("my_plugin");
  const text = params["Text Param"];
  const number = params["Number Param"];
  const file = params["File Param"];

  console.log(text, number, file);

  const lh = Window_Base.prototype.lineHeight() * 2;

  class MyWindow extends Window_Base {
    constructor() {
      super(0, 0, Graphics.boxWidth, lh);
      this.refresh();
    }

    async refresh() {
      this.contents.clear();
      this.drawText(text, number, 0);
      await Prom(() => console.log("WAit 1000"));
      await Prom(() => console.log("WAit 1000"));
      this.drawText(text + " waited 1000", number, 0);
    }
  }

  const Prom = (doSomething) =>
    new Promise((res, reject) => {
      setTimeout(() => {
        doSomething();
        res();
      }, 1000);
    });

  const originalSmStart = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    originalSmStart.apply(this, arguments);
    const my_window = new MyWindow();
    this.addChild(my_window);
  };

  const oriOnLeftButtonDown = TouchInput._onLeftButtonDown.bind(TouchInput);
  const oriOnTouchStart = TouchInput._onTouchStart.bind(TouchInput);
  TouchInput._onLeftButtonDown = (event) => {
    oriOnLeftButtonDown(event);
    onTouchOrMouseDown(event);
  };
  TouchInput._onTouchStart = (event) => {
    oriOnTouchStart(event);
    onTouchOrMouseDown(event);
  };
  TouchInput._onTouchMove = (event) => {}; //kill touch move

  function onTouchOrMouseDown(event) {
    console.log($gamePlayer);
    console.log(SceneManager._scene);

    let x,
      y = 0;
    try {
      if (event.changedTouches) {
        console.log(event.changedTouches.length);
        for (let i = 0; i < event.changedTouches.length; i++) {
          const touch = event.changedTouches[i];
          x = Graphics.pageToCanvasX(touch.pageX);
          y = Graphics.pageToCanvasY(touch.pageY);
        }
      }
    } catch (err) {
      x = Graphics.pageToCanvasX(event.pageX);
      y = Graphics.pageToCanvasY(event.pageY);
    }
    if (SceneManager._scene && SceneManager._scene._active) {
      console.log(SceneManager._scene);
    }

    if (
      !(SceneManager._scene instanceof Scene_Map) ||
      !$gamePlayer ||
      !Graphics.isInsideCanvas(x, y)
    )
      return;

    // debounce 100ms websocket to server
    console.log($gamePlayer._newX);
    console.log($gamePlayer._newY);

    const div = document.createElement("div");
    div.innerHTML = "Hello kakogi";
    div.style.position = "absolute";
    div.style.top = 0;
    div.style.color = "red";
    div.style.fontSize = 30;

    div.style.zIndex = 30;
    document.body.append(div);
  }

  setInterval(() => {
    if (!SceneManager._scene._active) return;

    if (Input.isPressed("right")) {
      console.log("right arrow pressed");
      // debounce 100ms websocket to server
      console.log($gamePlayer.x);
      console.log($gamePlayer.y);
    }
  }, 100);
})();
