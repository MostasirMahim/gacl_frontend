import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/bundle';
import 'react-modal-video/css/modal-video.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-photo-view/dist/react-photo-view.css';
import "react-datepicker/dist/react-datepicker.css";

import './assets/css/font-awesome.css';
import './assets/css/animate.css';
import './assets/css/flaticon-set.css';
import './assets/css/shop.css';
import './assets/css/helper.css';
import './assets/css/unit-test.css';
import './assets/css/validnavs.css';
import './assets/css/style.css';

import Dependency from "./_components/Dependency";
import type { Metadata } from "next";
import { Marcellus, Lato, Dancing_Script } from 'next/font/google';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-default',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-optional',
});

export const metadata: Metadata = {
  title: "Restan - Food & Restaurant NextJS Template",
};

export default function RestaurantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${marcellus.variable} ${lato.variable} ${dancingScript.variable}`}>
      <Dependency />
      {children}
    </div>
  );
}
