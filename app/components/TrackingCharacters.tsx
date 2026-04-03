"use client";

import Spline from '@splinetool/react-spline';

export default function TrackingCharacters() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto z-10">
      <Spline scene="https://prod.spline.design/qWcqS12O5Nnsy3Z6/scene.splinecode" />
    </div>
  );
}
