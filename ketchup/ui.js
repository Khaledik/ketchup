function createButton(text, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(
      "bg-yellow-400",
      "hover:bg-yellow-500",
      "px-12",
      "py-3",
      "rounded-xl",
      "font-medium",
      "text-xl",
      "shadow-inner",
      "shadow-white",
      "border-t-2",
      "border-x-2",
      "border-b-4",
      "border-yellow-600",
      "w-full"
    );
    button.addEventListener("click", clickHandler);
    return button;
  }
  
  export { createButton };
  