import math
import random
from PIL import Image, ImageDraw, ImageFilter

BASE_PATH = "../img/pagina.inicial.voz.do.bairro.jpeg"
OUT_PATH = "../img/pagina.inicial.voz.do.bairro.jpeggif"

base = Image.open(BASE_PATH).convert("RGBA")
w, h = base.size

# Opcional: reduzir um pouco se for muito grande para deixar o GIF leve
if w > 1280:
  ratio = 1280 / w
  base = base.resize((1280, int(h * ratio)), Image.Resampling.LANCZOS)
  w, h = base.size

rng = random.Random(42)  # semente fixa para loop previsível

# Cria várias luzes desfocadas espalhadas pela área do morro/cena
luzes = []
for _ in range(18):
  luzes.append({
      "cx": rng.uniform(0.08, 0.92) * w,
      "cy": rng.uniform(0.35, 0.92) * h,
      "raio": rng.uniform(45, 130) * (w / 1000),
      "blur": rng.uniform(22, 48) * (w / 1000),
      "fase": rng.uniform(0, math.tau),
      "velocidade": rng.uniform(1.0, 2.5),
      "cor": rng.choice([(220, 38, 38), (239, 68, 68), (185, 28, 28)]),
      "pico_alpha": rng.randint(95, 175),
  })

total_frames = 36
frames = []

for i in range(total_frames):
  t = (i / total_frames) * math.tau
  camada_luz = Image.new("RGBA", (w, h), (0, 0, 0, 0))
  draw = ImageDraw.Draw(camada_luz)

  for luz in luzes:
    # Pulso suave com pico aleatório por ciclo
    onda = (math.sin(t * luz["velocidade"] + luz["fase"]) + 1) / 2
    curva = onda**2.4
    alpha = int(luz["pico_alpha"] * curva)

    if alpha > 4:
      r = luz["raio"] * (0.85 + 0.25 * curva)
      x0, y0 = luz["cx"] - r, luz["cy"] - r
      x1, y1 = luz["cx"] + r, luz["cy"] + r
      draw.ellipse([x0, y0, x1, y1], fill=(*luz["cor"], alpha))

  # Aplica desfoque gaussiano nas luzes para ficarem bem difusas
  max_blur = max(l["blur"] for l in luzes)
  camada_luz = camada_luz.filter(ImageFilter.GaussianBlur(radius=max_blur * 0.45))

  # Combina base + luzes e converte para paleta GIF com boa qualidade
  composto = Image.alpha_composite(base, camada_luz).convert("RGB")
  frame_gif = composto.quantize(
      colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG
  )
  frames.append(frame_gif)

frames[0].save(
    OUT_PATH,
    save_all=True,
    append_images=frames[1:],
    duration=80,  # ~12.5 fps
    loop=0,
    optimize=True,
)
print("GIF gerado em:", OUT_PATH)