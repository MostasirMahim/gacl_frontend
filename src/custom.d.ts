declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'aos';
declare module 'bootstrap/dist/js/bootstrap.bundle.min.js';