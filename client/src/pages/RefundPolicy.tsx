import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "退貨與退款政策 — 迎利茶葉";
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.970 0.012 80)" }}>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          {/* 頁面標題 */}
          <div className="mb-10 border-b border-stone-300 pb-6">
            <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-2">退貨與退款政策</h1>
            <p className="text-stone-500 text-sm">最後更新：2025 年</p>
          </div>

          <div className="prose prose-stone max-w-none space-y-8 text-stone-700 leading-relaxed">
            <p className="text-base">
              感謝您在【迎利茶葉】進行購物。為保障您的權益，我們提供清晰透明的退換貨服務。請您在購買前詳細閱讀以下政策：
            </p>

            {/* 一 */}
            <section>
              <h2 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-amber-700">一、</span>退貨申請時限
              </h2>
              <p>
                根據台灣消費者保護法規定，我們提供商品到貨次日起 <strong>7 天的鑑賞期（猶豫期）</strong>。
              </p>
              <div className="mt-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-md text-sm">
                <strong>請注意：</strong>鑑賞期並非「試用期」。商品必須保持全新未拆封、未使用狀態，且包裝完整（包含商品本體、配件、贈品、保證書、原廠包裝及所有附隨文件或資料的完整性）。
              </div>
            </section>

            {/* 二 */}
            <section>
              <h2 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-amber-700">二、</span>無法退換貨的例外情況
              </h2>
              <p>
                依據「通訊交易解除權合理例外情事適用準則」，以下商品不適用 7 天鑑賞期，除商品本身有瑕疵外，一經拆封或使用恕不接受退換貨：
              </p>
              <ol className="mt-3 space-y-2 list-decimal list-inside">
                <li><strong>易於腐敗、保存期限較短或解約時即將逾期之商品</strong>（例如：已拆封之茶葉、食品、生鮮等）。</li>
                <li><strong>依消費者要求所為之客製化給付</strong>（例如：客製化禮盒、特殊包裝）。</li>
                <li><strong>個人衛生用品</strong>（例如：已拆封之杯具、餐具）。</li>
              </ol>
            </section>

            {/* 三 */}
            <section>
              <h2 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-amber-700">三、</span>退貨費用與運費承擔
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-stone-50 rounded-md border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">商品瑕疵 / 寄錯商品</p>
                  <p className="text-sm">若因商品本身瑕疵、破損或寄錯商品而導致的退換貨，來回運費將由【迎利茶葉】全額承擔。</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-md border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">個人因素退貨</p>
                  <p className="text-sm">若因個人因素（如：買錯商品、不喜歡、口味不合等）申請退貨，退貨運費由消費者自行負擔。您可以自行將商品寄回指定地址，或由我們安排物流前往取件，並於退款中扣除寄回運費新台幣 120 元。</p>
                </div>
              </div>
            </section>

            {/* 四 */}
            <section>
              <h2 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-amber-700">四、</span>退貨流程與處理方式
              </h2>
              <p>若您需要辦理退貨，請於收到商品 7 天內依照以下步驟申請：</p>
              <ol className="mt-3 space-y-3 list-decimal list-inside">
                <li>
                  <strong>聯絡客服：</strong>請透過網站信箱
                  <a href="mailto:yinglitea@gmail.com" className="text-amber-700 underline mx-1">yinglitea@gmail.com</a>
                  或官方聯絡管道，提供您的「訂單編號」及「退貨原因」（若為瑕疵商品請附上照片）。
                </li>
                <li><strong>商品打包：</strong>請將退貨商品（含完整包裝、贈品、發票）妥善包裝。</li>
                <li><strong>商品寄回：</strong>我們將安排物流人員於 3–5 個工作天內前往您填寫的收件地址取件。</li>
                <li><strong>商品查驗：</strong>我們在收到退回商品並確認符合退貨條件後，將於 7 個工作天內為您辦理退款。</li>
              </ol>
            </section>

            {/* 五 */}
            <section>
              <h2 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-amber-700">五、</span>退款方式與作業時間
              </h2>
              <p>我們收到退貨商品並確認無誤後，將依您原先的付款方式進行退款：</p>
              <div className="mt-3 space-y-3">
                <div className="p-4 bg-stone-50 rounded-md border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">信用卡付款</p>
                  <p className="text-sm">我們會直接辦理信用卡刷退。款項將退回您的原刷卡帳戶，實際退款到帳時間依各家發卡銀行作業流程而定（通常需要 7–14 個工作天，或顯示於下一期帳單）。</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-md border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">超商代碼 / ATM 轉帳 / 貨到付款</p>
                  <p className="text-sm">請提供您的銀行帳戶資料（銀行名稱、分行、帳號、戶名），我們將以銀行轉帳方式將款項退還給您（轉帳手續費由本公司負擔）。</p>
                </div>
              </div>
            </section>

            {/* 六 */}
            <section>
              <h2 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-amber-700">六、</span>聯絡我們
              </h2>
              <p>如果您對本退貨與退款政策有任何疑問，歡迎隨時與我們聯絡：</p>
              <div className="mt-3 p-5 bg-stone-50 rounded-md border border-stone-200 space-y-2 text-sm">
                <p><span className="font-semibold text-stone-700 w-24 inline-block">公司名稱</span>迎利茶業有限公司</p>
                <p>
                  <span className="font-semibold text-stone-700 w-24 inline-block">客服信箱</span>
                  <a href="mailto:yinglitea@gmail.com" className="text-amber-700 underline">yinglitea@gmail.com</a>
                </p>
                <p><span className="font-semibold text-stone-700 w-24 inline-block">客服電話</span>04-37042800</p>
                <p><span className="font-semibold text-stone-700 w-24 inline-block">服務時間</span>週一至週五 13:00 – 18:00</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <ContactFooter />
    </div>
  );
}
