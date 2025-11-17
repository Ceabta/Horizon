export interface StatusColor {
  bg: string;
  border: string;
  text: string;
  borderLeft: string;
}

export function getStatusColor(status: string): StatusColor {
  switch (status) {
    case "Concluído":
    case "Concluída":
      return {
        bg: "var(--card2-bg)",
        border: "var(--card2-icon)",
        text: "var(--card2-icon)",
        borderLeft: "rgb(22,163,74)",
      };
    case "Em Andamento":
    case "Pendente":
      return {
        bg: "var(--card1-bg)",
        border: "var(--card1-icon)",
        text: "var(--card1-icon)",
        borderLeft: "rgb(37, 99, 235)",
      };
    case "Cancelado":
    case "Cancelada":
      return {
        bg: "var(--card3-bg)",
        border: "var(--card3-icon)",
        text: "var(--card3-icon)",
        borderLeft: "rgb(234, 88, 12)",
      };
    case "Ativo":
      return {
        bg: "rgb(20, 83, 45)",
        border: "",
        text: "rgb(187, 247, 208)",
        borderLeft: "rgb(22,163,74)",
      };
    case "Inativo":
      return {
        bg: "rgb(127, 29, 29)",
        border: "",
        text: "rgb(254, 202, 202)",
        borderLeft: "red",
      };
    default:
      return {
        bg: "var(--card4-bg)",
        border: "var(--card4-icon)",
        text: "var(--card4-icon)",
        borderLeft: "rgb(147, 51, 234)",
      };
  }
}