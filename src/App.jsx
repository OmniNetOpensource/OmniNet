import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {Routes,Route,Link} from "react-router-dom"
import "./App.css";

const WORDS_LINE1 = "we love making".split('');
const WORDS_LINE2 = "cool stuffs".split('');
const PARAGRAPH_STRING = "好的念頭 是一切的開端 我們樂於動手將它實現 \n 不論這想法是自己苦思的 還是從眾人那裡得來的 每個念頭皆有其價值 \n 有時它清晰明確 有時仍有些模糊";

function ProjectsPage(){
  return (
    <>

    </>
  );
}


function HomePage({ mouse , screenCenter , omniTranslateX , setOmniTranslateX}){
  return (
    <div className="app-container">
      <div className="logo-container"
        onMouseEnter={() => setOmniTranslateX(-67)}
        onMouseLeave={() => setOmniTranslateX(0)}
      >
        <span
          style={{
            zIndex: "1002", // 原有的 z-index
            transform: `translateX(${omniTranslateX}%)`, // 根据状态动态设置 X 轴位移
            transition: "transform 0.3s ease-in-out", // 添加过渡效果，使移动更平滑
            display: 'inline-block' // `transform` 对 `inline` 元素可能不完全生效，改为 `inline-block`
          }}
        >
          Omni
        </span>
        <span>Net</span>
      </div>

      <main className="main-content">
        <div
          className="words-container"
        >
          {WORDS_LINE1.map((word, i) => (
            <SoapWord
              key={`line1-${i}`}
              word={
                <span
                  className="highlight-word"
                >
                  {word === " " ? "\u00A0" : word}
                </span>
              }
              mouse={mouse}
              screenCenter={screenCenter}
              // actualFontSize={200} // Removed, will be determined dynamically
            />
          ))}
        </div>
        <div className="paragraph-container">
          {PARAGRAPH_STRING.split('\n').map((line, lineIndex) => (
            <div key={`line-${lineIndex}`} className="paragraph-line">
              {line.split('').map((char, charIndex) => (
                <SoapWord
                  key={`para-char-${lineIndex}-${charIndex}`}
                  word={
                    <span
                      className="paragraph-word"
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  }
                  mouse={mouse}
                  screenCenter={screenCenter}
                  // actualFontSize={16} // Removed, will be determined dynamically
                />
              ))}
            </div>
          ))}
        </div>

        <div
          className="words-container"
        >
          {WORDS_LINE2.map((word, i) => (
            <SoapWord
              key={`line2-${i}`}
              word={
                <span
                  className="highlight-word highlight-word-large" // Added highlight-word-large for specific styling
                >
                  {word === " " ? "\u00A0" : word}
                </span>
              }
              mouse={mouse}
              screenCenter={screenCenter}
              // actualFontSize={200} // Removed, will be determined dynamically
            />
          ))}
        </div>
      </main>
    </div>
  );
}




function SoapWord({ word, mouse, screenCenter }) { // Removed actualFontSize from props
  const motionRef = useRef(); // Ref for the motion.div itself
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [dynamicFontSize, setDynamicFontSize] = useState(16); // Default font size

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 28 });
  const springY = useSpring(y, { stiffness: 350, damping: 28 });
  const springRotate = useSpring(rotate, { stiffness: 350, damping: 18 });
  
  useEffect(() => {
    if (motionRef.current) {
      const rect = motionRef.current.getBoundingClientRect();
      setCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });

      // Dynamically get font size of the text element
      const textElement = motionRef.current.querySelector('.highlight-word, .paragraph-word');
      if (textElement) {
        const style = window.getComputedStyle(textElement);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize && !isNaN(fontSize)) {
          setDynamicFontSize(fontSize);
        }
      }
    }
  }, [screenCenter, word, mouse]); // Add word and mouse as dependencies if font size might change with them or on interaction causing reflow

  useEffect(() => {
    if (!mouse.x && !mouse.y) return;
    
    const fontSizeToUse = dynamicFontSize; // Use dynamically obtained font size
    let currentMaxPush = fontSizeToUse * 5; // Adjust multiplier as needed
    let currentEffectRadius = fontSizeToUse * 0.5 + 80; // Adjust multiplier and base as needed

    // console.log(`Word: "${motionRef.current ? motionRef.current.innerText.trim() : 'N/A'}", Using dynamicFontSize: ${fontSizeToUse}, EffectRadius: ${currentEffectRadius}, MaxPush: ${currentMaxPush}`);

    const dx = mouse.x - center.x;
    const dy = mouse.y - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < currentEffectRadius) {
      let push = (currentEffectRadius - dist) * 1.2; // Keep push factor or adjust
      if (Math.abs(push) > currentMaxPush) {
        push = Math.sign(push) * currentMaxPush;
      }

      const angle = Math.atan2(dy, dx);

      x.set(-Math.cos(angle) * push);
      y.set(-Math.sin(angle) * push);

      let degree = (angle * 180) / Math.PI;
      rotate.set(degree / 4);
    } else {
      x.set(0);
      y.set(0);
      rotate.set(0);
    }
  }, [mouse, center, dynamicFontSize, x, y, rotate]); // Added dynamicFontSize and motion values to dependencies

  return (
    <motion.div
      ref={motionRef} // Use motionRef here
      style={{
        x: springX,
        y: springY,
        rotate: springRotate,
      }}
      className="select-none pointer-events-none soap-word-motion"
    >
      {word}
    </motion.div>
  );
}

export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });
  const [omniTranslateX, setOmniTranslateX] = useState(0);

  useEffect(() => {
    const updateMouse = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  useEffect(() => {
    const updateCenter = () => {
      setScreenCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };
    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <HomePage
          mouse={mouse}
          screenCenter={screenCenter}
          omniTranslateX={omniTranslateX}
          setOmniTranslateX={setOmniTranslateX}
        />}
      />
    </Routes>
  );
}
