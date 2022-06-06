import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    // Nouvelle note de frais
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    buttonNewBill?.addEventListener("click", this.handleClickNewBill);

    // Icon Eye
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    iconEye.forEach((icon) => {
      icon.addEventListener("click", () => this.handleClickIconEye(icon));
    });
    new Logout({ document, localStorage, onNavigate });
  }

  // Direction NewBill
  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  // Open modal image
  handleClickIconEye = (icon) => {
    // url image
    const billUrl = icon.getAttribute("data-bill-url");
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
    $("#modaleFile")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );
    if (typeof $("#modaleFile").modal === "function")
      $("#modaleFile").modal("show");
  };

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((doc) => {
              try {
                return {
                  ...doc,
                  date: formatDate(doc.date),
                  status: formatStatus(doc.status),
                };
              } catch (e) {
                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                // log the error and return unformatted date in that case
                console.log(e, "for", doc);
                return {
                  ...doc,
                  date: doc.date,
                  status: formatStatus(doc.status),
                };
              }
            });
          return bills;
        });
    }
  };
}
