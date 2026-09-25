import { useEffect, useMemo, useState } from "react";
import { BookMarked,Eraser,Paintbrush,Play,Plus,RefreshCw, Save,Scissors, Search, Tag,Trash2 } from "lucide-react";
import { Grid } from "../lib/grid";
import { hints } from "./helper";

const LIB_HELP = 'Reuse a recurring shape by stamping it into other characters instead of redrawing each time.';

export interface ComponentLibProps {
}