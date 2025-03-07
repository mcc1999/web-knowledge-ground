import { RefObject, useEffect, useState } from "react";

const useTodoItemHeight = (ref: RefObject<HTMLDivElement>) => {
  const [todoItemHeight, setTodoItemHeight] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const resizeObserver = new ResizeObserver(() => {
      setTodoItemHeight(node.getBoundingClientRect().height);
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.unobserve(node);
    };
  });

  return { height: todoItemHeight };
};

export default useTodoItemHeight;
