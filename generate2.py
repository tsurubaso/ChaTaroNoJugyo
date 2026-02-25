import bpy
import sys

# ------------------------
# 引数取得
# ------------------------
argv = sys.argv
argv = argv[argv.index("--") + 1:] if "--" in argv else []

size = float(argv[0]) if len(argv) > 0 else 2.0

# ------------------------
# シーン初期化
# ------------------------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ------------------------
# Cube生成
# ------------------------
bpy.ops.mesh.primitive_cube_add(size=size)
cube = bpy.context.object
cube.location = (0, 0, size / 2)

# ------------------------
# マテリアル
# ------------------------
mat = bpy.data.materials.new(name="RedMaterial")
mat.diffuse_color = (1, 0, 0, 1)
cube.data.materials.append(mat)

# ------------------------
# 出力
# ------------------------
bpy.ops.export_scene.gltf(filepath="output.glb")