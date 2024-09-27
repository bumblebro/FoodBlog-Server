function Delay() {
  return new Promise((res) => {
    setTimeout(res, 10000);
  });
}

export default Delay;
