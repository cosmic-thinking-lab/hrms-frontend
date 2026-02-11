import React from 'react';
import { useScrollAnimation } from '../utils/useAnimations';

const AnimationDemo = () => {
  const [ref1, isVisible1] = useScrollAnimation();
  const [ref2, isVisible2] = useScrollAnimation();
  const [ref3, isVisible3] = useScrollAnimation();

  return (
    <div className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* Fade In Animation */}
        <div 
          ref={ref1}
          className={`scroll-animate ${isVisible1 ? 'animate' : ''} text-center`}
        >
          <h2 className="text-4xl font-bold mb-6">Smooth Animations</h2>
          <p className="text-lg text-neutral-600">
            This content fades in as you scroll down
          </p>
        </div>

        {/* Slide Animations */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="scroll-animate-left">
            <div className="card-hover bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Slide from Left</h3>
              <p className="text-neutral-600">This card slides in from the left</p>
            </div>
          </div>
          
          <div className="scroll-animate-right">
            <div className="card-hover bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Slide from Right</h3>
              <p className="text-neutral-600">This card slides in from the right</p>
            </div>
          </div>
        </div>

        {/* Scale Animation */}
        <div 
          ref={ref2}
          className={`scroll-animate-scale ${isVisible2 ? 'animate' : ''}`}
        >
          <div className="card-tilt bg-gradient-to-br from-primary-500 to-orange-400 p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Scale Animation</h3>
            <p className="text-white-80">This card scales in with a tilt effect on hover</p>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div 
          ref={ref3}
          className={`scroll-animate ${isVisible3 ? 'animate' : ''} text-center space-x-4`}
        >
          <button className="btn-primary">
            Primary Button
          </button>
          <button className="btn-secondary">
            Secondary Button
          </button>
        </div>

        {/* Floating Elements */}
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((item, index) => (
            <div 
              key={item}
              className="scroll-animate animate-float bg-white p-6 rounded-xl shadow-lg text-center"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-600 font-bold">{item}</span>
              </div>
              <h4 className="font-semibold">Feature {item}</h4>
              <p className="text-sm text-neutral-600 mt-2">Floating animation</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AnimationDemo;