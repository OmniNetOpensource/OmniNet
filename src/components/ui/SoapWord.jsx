// 移除了未使用的 framer-motion 导入
import React, { useEffect, useRef } from 'react';
// 修正導入樣式路徑錯誤，指向 src/styles 目錄
import '../../styles/globals.css'

export default function Soapword({ textString }) {
    const textRef = useRef(null);
    const animationFrameId = useRef(null); // 用于存储 requestAnimationFrame 的 ID

    const animationState = useRef({
        currentX: 0,
        targetX: 0,
        currentY: 0,
        targetY: 0,
        currentRotation: 0,
        targetRotation: 0,
    });

    // 將傳入的字串拆分為單個字元陣列
    const text = textString.split('');
    
    useEffect(() => {
        const textElement = textRef.current;
        if (!textElement) return;

        // 变量名 'effectRadiusRef' 有点误导性，因为它不是一个 ref。
        // 改为 'effectRadius' 更清晰。
        const fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
        const effectRadius = 2 * fontSize / Math.sqrt(2) + 20;
        //console.log(effectRadius);
        const handleMouseMove = (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const rect = textElement.getBoundingClientRect();
            const positionX = rect.left + rect.width / 2;
            const positionY = rect.top + rect.height / 2;

            const dX = mouseX - positionX;
            const dY = mouseY - positionY;

            const dist = Math.sqrt(dX * dX + dY * dY);

            let moveX = 0;
            let moveY = 0;

            if (dist <= effectRadius) {
                const angle = Math.atan2(dY, dX);
                const force = effectRadius - dist;

                // FIX 4: 增加了负号，实现“推开”效果
                moveX = -force * Math.cos(angle);
                moveY = -force * Math.sin(angle);
            }

            animationState.current.targetX = moveX;
            animationState.current.targetY = moveY;
        };

        // 将事件监听器绑定到 handleMouseMove 函数
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            const push = 0.25;
            
            // FIX 2: 正确地从 ref 的 .current 属性获取状态
            const state = animationState.current;

            state.currentX += (state.targetX - state.currentX) * push;
            state.currentY += (state.targetY - state.currentY) * push;

            textElement.style.transform = `translate(${state.currentX}px, ${state.currentY}px)`;

            // 将 requestAnimationFrame 的 ID 存入 ref
            animationFrameId.current = requestAnimationFrame(animate);
        };
        
        // FIX 1: 启动动画循环！
        animate();

        // FIX 3: 添加清理函数！
        return () => {
            // 组件卸载时，移除事件监听器
            window.removeEventListener('mousemove', handleMouseMove);
            
            // 组件卸载时，取消动画循环
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []); // 空依赖数组确保这个 effect 只运行一次

    return (
        <span
            ref={textRef}
            style={{ display: 'inline-block', // inline-block 是必须的
                     willChange: 'transform', // 小优化：告诉浏览器这个元素的 transform 会变
                     cursor: 'default'
            }}
        >
            {text === ' ' ? '\u00A0' : text}
        </span>
    );
}