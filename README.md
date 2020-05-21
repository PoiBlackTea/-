## 碩士論文程式


**實作** 
- Web Server: Django (Python)
- Browser Extension: Chrome (JavaScript + HTML + CSS)
 
> Auth_system (folder)是Chrome Extension的資料夾 <br>
> django (folder)是Web Server的資料夾


**登入系統**包含三種登入模式：
-	N登入模式：一般 (Normal) 登入模式，此模式適合在一般私人環境沒有擷取攻擊疑慮的場所，且登入之網站為通過可信管道時使用，例如：使用者於個人住宅登入之網站為通過自行在可信任之搜尋引擎搜尋或者瀏覽器書籤功能紀錄之非不明連結。
- PC登入模式：可抵擋釣魚攻擊與擷取攻擊 (Anti-Phishing & Capture) 之登入模式，此模式適合在身處於公共空間，例如：捷運、咖啡廳等場合進行使用。
- P登入模式：可抵擋釣魚攻擊 (Anti-Phishing) 之登入模式，此模式適合在非公開場合但登入之網站可能非來自可信之網站時使用。

使用者在登入系統時可依照所處環境之安全以及使用需求選擇適合的登入模式

論文的核心概念為利用過去可抵擋擷取攻擊的通行碼認證系統去抵擋釣魚攻擊，然而因為釣魚攻擊者可以控制挑戰回應的內容，因此我提出透過browser extension與server分別產生random number後，利用SHA256來生成不受任一方控制的關鍵參數SEED作為認證系統底層隨機性的種子。SEED計算如下:
> SEED=SHA256(Rs||Rc||URLs )
*********************
**實作成果**
- Browser extension popup window
![](https://github.com/PoiBlackTea/Master-s-thesis/blob/master/image/Browser%20Extension%20popup%20windows.png)
- PC model 
![](https://github.com/PoiBlackTea/Master-s-thesis/blob/master/image/PC%20model%20login%20screen.png)
- P model
![](https://github.com/PoiBlackTea/Master-s-thesis/blob/master/image/P%20model%20login%20screen.png)



