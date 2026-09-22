import {ComponentProps, PointerEvent, useEffect, useMemo, useRef, useState} from 'react';
import {Minus, Plus, SlidersHorizontal, Type} from 'lucide-react';
import { Tool, Variation, basePairLatin, digitChars, googleFontsCatalog, punctuationChars, variations } from './lib/constants';

// TODO: implement layer cloning, then add
import { Grid, blank, defaultLetter, dilate, resample,seed, shear, validGrid } from './lib/grid';