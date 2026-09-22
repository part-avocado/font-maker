// external package
import {ComponentProps, PointerEvent, useEffect, useMemo, useRef, useState} from 'react';
import {Minus, Plus, SlidersHorizontal, Type} from 'lucide-react';

// ./lib/*
import { Tool, Variation, basePairLatin, digitChars, googleFontsCatalog, punctuationChars, variations } from './lib/constants';
import {download} from './lib/download'
import { exportSvg } from './lib/svg-export';
import { Grid, blank, defaultLetter, dilate, resample,seed, shear, validGrid } from './lib/grid';

// ./hooks/*

// ./components/*
import { characterSidebar,  } from './components/characterSidebar';
import { hints } from './components/helper';
import { introductionPanel } from './components/intro';
import { fontLib } from './components/fontLib';