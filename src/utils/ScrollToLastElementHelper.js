export const scroll = (scrollTo, document, window, id) => {
  const element = document.querySelector(id + scrollTo);
  const offset = 45;
  const bodyRect = document.body?.getBoundingClientRect()?.top;
  const elementRect = element?.getBoundingClientRect()?.top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};
