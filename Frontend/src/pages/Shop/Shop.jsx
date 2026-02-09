import React from "react";

export default function ShopPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/shop_bg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 text-center font-arcade px-6 py-4 bg-transparent">
        <h1 className="text-white text-[80px] md:text-[50px] tracking-[0.35em] leading-tight mb-20 pixel-outline">
          WELCOME&nbsp;TO
          <br />
          THE&nbsp;SHOP
          <br />
          <br />
          <br />
        </h1>
        <p className="text-white text-[52px] md:text-[40px] tracking-[0.3em] pixel-outline">
          ITS&nbsp;NOT&nbsp;CHEATING&nbsp;IF&nbsp;YOU&nbsp;PAY
        </p>
      </div>
    </div>
  );
}
