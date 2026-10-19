import zlib, struct, math

def create_rich_board(filename, title, subtitle, garment_type, primary_rgb, accent_rgb):
    width, height = 800, 800
    pixels = bytearray()
    
    # Pre-render pixels in memory
    # Background: Luxury dark atelier charcoal / deep burgundy (#140f11)
    bg_r, bg_g, bg_b = 20, 15, 17
    card_r, card_g, card_b = 30, 22, 26
    border_r, border_g, border_b = 223, 181, 108 # Gold #dfb56c
    text_gold_r, text_gold_g, text_gold_b = 247, 226, 169
    
    # Raster map: 800 x 800
    img = [[(bg_r, bg_g, bg_b) for _ in range(width)] for _ in range(height)]
    
    # 1. Outer borders
    for x in range(width):
        for y in range(8):
            img[y][x] = (border_r, border_g, border_b)
            img[height - 1 - y][x] = (border_r, border_g, border_b)
    for y in range(height):
        for x in range(8):
            img[y][x] = (border_r, border_g, border_b)
            img[y][width - 1 - x] = (border_r, border_g, border_b)
            
    # Thin inner border
    for x in range(16, width - 16):
        img[16][x] = (border_r, border_g, border_b)
        img[height - 17][x] = (border_r, border_g, border_b)
    for y in range(16, height - 16):
        img[y][16] = (border_r, border_g, border_b)
        img[y][width - 17] = (border_r, border_g, border_b)

    # Header Bar (y: 20 to 90)
    for y in range(20, 90):
        for x in range(20, width - 20):
            img[y][x] = (card_r, card_g, card_b)
    for x in range(20, width - 20):
        img[90][x] = (border_r, border_g, border_b)

    # 4 Corner Accents
    for i in range(20):
        img[20 + i][20] = (border_r, border_g, border_b)
        img[20][20 + i] = (border_r, border_g, border_b)
        img[20 + i][width - 21] = (border_r, border_g, border_b)
        img[20][width - 21 - i] = (border_r, border_g, border_b)
        img[height - 21 - i][20] = (border_r, border_g, border_b)
        img[height - 21][20 + i] = (border_r, border_g, border_b)
        img[height - 21 - i][width - 21] = (border_r, border_g, border_b)
        img[height - 21][width - 21 - i] = (border_r, border_g, border_b)

    # Left Section: 3D Dress Mannequin Studio (x: 40 to 450, y: 110 to 620)
    for y in range(110, 620):
        for x in range(40, 450):
            # Subtle radial atelier spotlight
            dx = x - 245
            dy = y - 350
            dist = math.sqrt(dx*dx + dy*dy)
            if dist < 220:
                glow = int((1 - dist/220) * 25)
                img[y][x] = (min(255, 15 + glow), min(255, 10 + glow), min(255, 12 + glow))
            else:
                img[y][x] = (12, 8, 10)
    for x in range(40, 450):
        img[110][x] = (border_r, border_g, border_b)
        img[620][x] = (border_r, border_g, border_b)
    for y in range(110, 620):
        img[y][40] = (border_r, border_g, border_b)
        img[y][450] = (border_r, border_g, border_b)

    # Draw Mannequin Stand on Left View
    cx = 245
    # Pole
    for y in range(160, 600):
        for x in range(cx - 2, cx + 3):
            img[y][x] = (40, 30, 20)
    # Turntable Base Disc (oval)
    for y in range(570, 605):
        for x in range(cx - 70, cx + 71):
            if ((x - cx)**2) / (70**2) + ((y - 587)**2) / (15**2) <= 1:
                img[y][x] = (card_r + 20, card_g + 15, card_b + 10)
    for x in range(cx - 70, cx + 71):
        y_top = int(587 - 15 * math.sqrt(max(0, 1 - ((x - cx)**2) / (70**2))))
        img[y_top][x] = (border_r, border_g, border_b)

    # Draw the specific 3D Dress on Mannequin
    pr, pg, pb = primary_rgb
    ar, ag, ab = accent_rgb

    # Draw Torso & Garment Silhouette
    for y in range(170, 560):
        for x in range(cx - 140, cx + 141):
            dx = abs(x - cx)
            # Body contours
            if garment_type == 'gown':
                # Floor length flared gown with French Darts & high slit
                if 170 <= y <= 210: # Neck / Straps
                    if 18 <= dx <= 38:
                        img[y][x] = (pr, pg, pb)
                elif 210 < y <= 260: # Bodice
                    target_w = 42 + (y - 210) * 0.1
                    if dx <= target_w:
                        # French dart stitch line at dx == 25
                        if int(dx) in [24, 25]:
                            img[y][x] = (255, 255, 255)
                        else:
                            shade = max(0.6, 1 - dx/60)
                            img[y][x] = (int(pr*shade), int(pg*shade), int(pb*shade))
                elif 260 < y <= 330: # Waist to Hip
                    target_w = 34 + (y - 260) * 0.5
                    if dx <= target_w:
                        shade = max(0.6, 1 - dx/70)
                        img[y][x] = (int(pr*shade), int(pg*shade), int(pb*shade))
                elif 330 < y <= 560: # Flared Skirt with Slit
                    progress = (y - 330) / 230
                    target_w = 69 + progress * 70
                    if dx <= target_w:
                        # Thigh high walking slit on right side (x > cx + 15)
                        if y > 370 and 20 <= (x - cx) <= 24:
                            img[y][x] = (text_gold_r, text_gold_g, text_gold_b)
                        elif y > 370 and 0 < (x - cx) < 20:
                            # Inner leg shadow
                            img[y][x] = (card_r + 10, card_g + 8, card_b + 5)
                        else:
                            # Sunburst pleat lines
                            pleat = (x + y) % 35
                            shade = 0.85 if pleat < 4 else (1.0 if pleat < 18 else 0.75)
                            img[y][x] = (min(255, int(pr*shade)), min(255, int(pg*shade)), min(255, int(pb*shade)))

            elif garment_type == 'princess':
                # Princess Cut Tailored Coat with Notched Lapel & Flap Pockets
                if 170 <= y <= 200: # Notched Lapel Collar
                    if dx <= 45:
                        img[y][x] = (ar, ag, ab)
                elif 200 < y <= 270: # Bodice & Sleeves
                    target_w = 46 + (y - 200) * 0.2
                    if dx <= target_w:
                        # Continuous Princess Seam at dx == 22
                        if int(dx) in [21, 22]:
                            img[y][x] = (border_r, border_g, border_b)
                        else:
                            shade = max(0.65, 1 - dx/70)
                            img[y][x] = (int(pr*shade), int(pg*shade), int(pb*shade))
                    # Sleeves
                    if target_w < dx <= target_w + 24:
                        img[y][x] = (int(pr*0.8), int(pg*0.8), int(pb*0.8))
                elif 270 < y <= 510: # Coat Skirt & Pockets
                    progress = (y - 270) / 240
                    target_w = 58 + progress * 62
                    if dx <= target_w:
                        # Princess Seams continuing down
                        if abs(dx - (22 + progress*18)) < 1.5:
                            img[y][x] = (border_r, border_g, border_b)
                        elif 340 <= y <= 352 and 30 <= dx <= 60: # Flap Pockets
                            img[y][x] = (border_r, border_g, border_b)
                        else:
                            shade = max(0.65, 1 - dx/100)
                            img[y][x] = (int(pr*shade), int(pg*shade), int(pb*shade))
                    # Single gold button at y=280
                    if 276 <= y <= 286 and dx <= 5:
                        img[y][x] = (border_r, border_g, border_b)

            elif garment_type == 'shift':
                # Fit Dress with Tulip Drape & Contoured Square Neck
                if 170 <= y <= 210: # Square Neckline
                    if 22 <= dx <= 42:
                        img[y][x] = (pr, pg, pb)
                elif 210 < y <= 265: # Fitted Bodice
                    target_w = 42
                    if dx <= target_w:
                        shade = max(0.7, 1 - dx/60)
                        img[y][x] = (int(pr*shade), int(pg*shade), int(pb*shade))
                    # 3/4 Sleeves
                    if target_w < dx <= target_w + 18 and y <= 350:
                        img[y][x] = (int(pr*0.8), int(pg*0.8), int(pb*0.8))
                elif 265 < y <= 510: # Fitted Midi Skirt with Tulip Wrap Drape
                    progress = (y - 265) / 245
                    target_w = 42 + math.sin(progress * 3.14) * 14
                    if dx <= target_w:
                        # Diagonal tulip pleat curves
                        tulip_line = int(265 + (x - (cx - 40)) * 2.2)
                        if abs(y - tulip_line) < 2 or abs(y - (tulip_line + 30)) < 2:
                            img[y][x] = (255, 255, 255)
                        elif y > 420 and abs(x - (cx - 15)) <= 2: # Walking vent
                            img[y][x] = (border_r, border_g, border_b)
                        else:
                            shade = max(0.65, 1 - dx/70)
                            img[y][x] = (int(pr*shade), int(pg*shade), int(pb*shade))

            elif garment_type == 'skirt':
                # A-Line Pleated Maxi Skirt with High Contoured Waistband
                if 250 <= y <= 280: # Contoured 2-inch Waistband
                    if dx <= 46:
                        img[y][x] = (border_r, border_g, border_b) if y in [250, 280] or dx == 46 else (card_r + 40, card_g + 30, card_b + 20)
                elif 280 < y <= 560: # Flared Skirt with Box Pleats
                    progress = (y - 280) / 280
                    target_w = 48 + progress * 95
                    if dx <= target_w:
                        # Deep box pleat creases
                        pleat_pos = int((x - (cx - target_w)) / (target_w * 2 / 6))
                        pleat_x = (x - (cx - target_w)) % int(target_w * 2 / 6)
                        if pleat_x < 4:
                            img[y][x] = (border_r, border_g, border_b)
                        elif pleat_x < 12:
                            img[y][x] = (int(pr*0.65), int(pg*0.65), int(pb*0.65))
                        else:
                            shade = max(0.7, 1 - dx/120)
                            img[y][x] = (int(pr*shade), int(pg*shade), int(pb*shade))

    # Right Section: Technical Insets, CAD Flat & Details (x: 470 to 760, y: 110 to 620)
    for y in range(110, 620):
        for x in range(470, 760):
            img[y][x] = (card_r - 5, card_g - 5, card_b - 5)
    for x in range(470, 760):
        img[110][x] = (border_r, border_g, border_b)
        img[620][x] = (border_r, border_g, border_b)
    for y in range(110, 620):
        img[y][470] = (border_r, border_g, border_b)
        img[y][760] = (border_r, border_g, border_b)

    # Inset 1: CAD Technical Flat Drawing (x: 485 to 745, y: 125 to 345)
    for y in range(125, 345):
        for x in range(485, 745):
            img[y][x] = (15, 12, 14)
    for x in range(485, 745):
        img[125][x] = (border_r, border_g, border_b)
        img[345][x] = (border_r, border_g, border_b)
    for y in range(125, 345):
        img[y][485] = (border_r, border_g, border_b)
        img[y][745] = (border_r, border_g, border_b)

    # CAD Wireframe lines inside Inset 1
    cad_cx = 615
    for y in range(145, 330):
        # Draw technical pattern contour lines
        w = int(25 + (y - 145) * 0.35)
        for offset in [-w, w]:
            img[y][cad_cx + offset] = (text_gold_r, text_gold_g, text_gold_b)
        # Center grainline
        if y % 6 < 4:
            img[y][cad_cx] = (border_r, border_g, border_b)
        # Cross balance lines
        if y in [180, 230, 280]:
            for x in range(cad_cx - w, cad_cx + w + 1):
                img[y][x] = (border_r, border_g, border_b)

    # Inset 2: 4 Precision Detail Zoom Swatches (x: 485 to 745, y: 365 to 600)
    for idx, (bx, by) in enumerate([(495, 375), (620, 375), (495, 490), (620, 490)]):
        bw, bh = 115, 95
        for y in range(by, by + bh):
            for x in range(bx, bx + bw):
                img[y][x] = (22, 18, 20)
        for x in range(bx, bx + bw):
            img[by][x] = (border_r, border_g, border_b)
            img[by + bh][x] = (border_r, border_g, border_b)
        for y in range(by, by + bh):
            img[y][bx] = (border_r, border_g, border_b)
            img[y][bx + bw] = (border_r, border_g, border_b)
        # Fabric swatch swatch circle inside each box
        scx, scy = bx + 57, by + 47
        for y in range(by + 10, by + bh - 10):
            for x in range(bx + 15, bx + bw - 15):
                if ((x - scx)**2) / 36**2 + ((y - scy)**2) / 28**2 <= 1:
                    shade = 0.9 + 0.1 * math.sin((x+y)*0.3)
                    img[y][x] = (min(255, int(pr*shade)), min(255, int(pg*shade)), min(255, int(pb*shade)))

    # Bottom Turntable Gallery (8 Angles: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°) (y: 640 to 765)
    for y in range(640, 765):
        for x in range(40, width - 40):
            img[y][x] = (card_r - 8, card_g - 8, card_b - 8)
    for x in range(40, width - 40):
        img[640][x] = (border_r, border_g, border_b)
        img[765][x] = (border_r, border_g, border_b)
    for y in range(640, 765):
        img[y][40] = (border_r, border_g, border_b)
        img[y][width - 40] = (border_r, border_g, border_b)

    # 8 Turntable angle thumbnail frames
    box_w = 78
    box_h = 100
    for i, deg in enumerate([0, 45, 90, 135, 180, 225, 270, 315]):
        bx = 52 + i * (box_w + 10)
        by = 650
        for y in range(by, by + box_h):
            for x in range(bx, bx + box_w):
                img[y][x] = (15, 12, 14)
        for x in range(bx, bx + box_w):
            img[by][x] = (border_r, border_g, border_b)
            img[by + box_h][x] = (border_r, border_g, border_b)
        for y in range(by, by + box_h):
            img[y][bx] = (border_r, border_g, border_b)
            img[y][bx + box_w] = (border_r, border_g, border_b)

        # Draw mini angle silhouette inside
        mb_cx = bx + box_w // 2
        for y in range(by + 15, by + box_h - 15):
            # Rotated angle width
            factor = math.cos(math.radians(deg))
            mw = int(8 + abs(factor) * 14)
            for x in range(mb_cx - mw, mb_cx + mw + 1):
                img[y][x] = (int(pr*0.9), int(pg*0.9), int(pb*0.9))

    # Compress and output PNG
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # filter
        for x in range(width):
            raw_data.extend(img[y][x])
            
    compressed = zlib.compress(bytes(raw_data), 6)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        crc = struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
        return c + crc

    png.extend(chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)))
    png.extend(chunk(b'IDAT', compressed))
    png.extend(chunk(b'IEND', b''))
    
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Created: {filename} ({len(png)} bytes)")

# 1. French Darts Gown
create_rich_board('public/Blush Rose Gown Design Board.png', 
                  'FRENCH DARTS EVENING GOWN', 
                  'Blush Rose Silk Satin with Sculptural Darts & Walking Slit',
                  'gown',
                  (223, 159, 168), # Blush Rose #df9fa8
                  (223, 204, 163)) # Champagne

# 2. Princess Cut Coat
create_rich_board('public/35e9fa5a-373a-43f6-86d5-c5509c25b364.png',
                  'PRINCESS CUT TAILORED COAT',
                  'Tailored Rose Wool with Continuous Princess Seams & Notched Lapel',
                  'princess',
                  (217, 141, 156), # Rose Wool #d98d9c
                  (223, 181, 108)) # Gold

# 3. Fit Dress
create_rich_board('public/Mauve Dress Design Showcase Board.png',
                  'FIT DRESS (TULIP DRAPE)',
                  'Dusty Mauve Sheath Midi with Asymmetrical Wrap Pleats',
                  'shift',
                  (163, 114, 128), # Dusty Mauve #a37280
                  (247, 226, 169)) # Light Gold

# 4. A-Line Skirt
create_rich_board('public/567e2f4c-6d6d-4f2b-8f24-7605bf6a6889.png',
                  'A-LINE PLEATED MAXI SKIRT',
                  'Contoured High Waistband with Structured Deep Box Pleats',
                  'skirt',
                  (212, 148, 162), # Blush Pink #d494a2
                  (222, 212, 195)) # Oatmeal Beige

print("All 4 Couture Design Board PNGs successfully generated in public/ directory!")
