import React, { useEffect, useRef } from 'react';
import '../../styles/globals.css'; // 假设样式路径已修正

export default function Soapword({ text }) {
    const textRef = useRef(null);
    const animationFrameId = useRef(null);
    const lastMouseAngle = useRef(null);

    // 新增速度属性
    const animationState = useRef({
        currentX: 0,
        targetX: 0,
        velocityX: 0,
        currentY: 0,
        targetY: 0,
        velocityY: 0,
        currentRotation: 0,
        targetRotation: 0,
        velocityRotation: 0,
    });

    useEffect(() => {
        const textElement = textRef.current;
        if (!textElement) return;

        const fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
        const effectRadius = 2 * fontSize / Math.sqrt(2) + 20;

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
            let moveRotation = 0;

            if (dist <= effectRadius) {
                const angle = Math.atan2(dY, dX);
                const force = (effectRadius - dist) * 0.5;

                moveX = -force * Math.cos(angle);
                moveY = -force * Math.sin(angle);

                if (lastMouseAngle.current != null) {
                    let rawDiff = angle - lastMouseAngle.current;
                    if (rawDiff > Math.PI) rawDiff -= 2 * Math.PI;
                    if (rawDiff < -Math.PI) rawDiff += 2 * Math.PI;
                    moveRotation = rawDiff * (180 / Math.PI) / 10;
                }

                animationState.current.targetRotation += moveRotation;
                lastMouseAngle.current = angle;
            } else {
                animationState.current.targetRotation = 0;
                lastMouseAngle.current = null;
            }

            animationState.current.targetX = moveX;
            animationState.current.targetY = moveY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // 你可以在这里调整弹簧参数
        const stiffness = 0.18; // 弹性刚度，越大弹跳越强
        const damping = 0.65;   // 阻尼，越小弹跳越明显（但不能为0，建议0.5~0.8）

        const animate = () => {
            const state = animationState.current;

            // X轴弹簧动画
            let forceX = (state.targetX - state.currentX) * stiffness;
            state.velocityX = (state.velocityX + forceX) * damping;
            state.currentX += state.velocityX;

            // Y轴弹簧动画
            let forceY = (state.targetY - state.currentY) * stiffness;
            state.velocityY = (state.velocityY + forceY) * damping;
            state.currentY += state.velocityY;

            // 旋转弹簧动画
            let forceRotation = (state.targetRotation - state.currentRotation) * stiffness;
            state.velocityRotation = (state.velocityRotation + forceRotation) * damping;
            state.currentRotation += state.velocityRotation;

            textElement.style.transform = `translate(${state.currentX}px, ${state.currentY}px) rotate(${state.currentRotation}deg)`;

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <span
            ref={textRef}
            style={{
                display: 'inline-block',
                willChange: 'transform',
                cursor: 'default',
                userSelect: 'none',      // <--- 禁止文本选中
                WebkitUserSelect: 'none',// <--- 兼容 Safari/旧版 Chrome
                MozUserSelect: 'none',   // <--- 兼容 Firefox
                msUserSelect: 'none',    // <--- 兼容 IE/Edge
            }}
        >
            {text === ' ' ? '\u00A0' : text}
        </span>
    );
}
