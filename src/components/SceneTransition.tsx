/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SceneTransitionProps {
  sceneId: string;
}

export default function SceneTransition({ sceneId }: SceneTransitionProps) {
  const [active, setActive] = useState(false);
  const [key, setKey] = useState(sceneId);

  useEffect(() => {
    if (sceneId !== key) {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
        setKey(sceneId);
      }, 400); // Snappy, 400ms total transition time
      return () => clearTimeout(timer);
    }
  }, [sceneId, key]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="fixed inset-0 z-50 pointer-events-none bg-black/60 flex items-center justify-center"
        >
          {/* Subtle cinematic minimalist scale transition */}
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.25 }}
            exit={{ scale: 1.02, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#ffdfa0] font-bold"
          >
            Wczytywanie...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
