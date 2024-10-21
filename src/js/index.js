import data from "./data.json";
import Row from "./Row";
const productsDiv = document.querySelector("#products");

const renderRows = function (items) {
  const domNodes = items
    .map(({ product, cost, totalCost = "N/A" }) =>
      Row(product, cost, totalCost)
    )
    .join("");

  productsDiv.innerHTML = domNodes;
};

const totalCost = function (tax, shipping, cost) {
  return (Number(tax) / 100) * Number(cost) + Number(cost) + Number(shipping);
};

// smartphones and catfood are taxed at 12%
// televisions are taxed at 18%
// Default shipping rates (if absent in dataset): Pet food (2.5), Smartphones (5), Televisions (15)

const prepCurry = (fn) =>
  function curry(...args) {
    return args.length === fn.length
      ? fn(...args)
      : (...newArgs) => curry(...args, ...newArgs);
  };

const totalCostCurr = prepCurry(totalCost);

const tax = {
  tax12: totalCostCurr(12),
  tax18: totalCostCurr(18),
};

const shipping = {
  petfood: tax.tax12(2.5),
  smartphones: tax.tax12(5),
  televisions: tax.tax18(15),
};

(() => {
  const revised = data.map((e) => {
    return {
      ...e,
      totalCost:
        e.shipping === null
          ? shipping[e.category](e.cost)
          : ["petfood", "smartphones"].includes(e.category)
          ? tax.tax12(e.shipping)(e.cost)
          : tax.tax18(e.shipping)(e.cost),
    };
  });
  renderRows(revised);
})();
