import bpy
import sys

# 引数取得
argv = sys.argv
argv = argv[argv.index("--") + 1:]

shape = argv[0] if len(argv) > 0 else "cube"
size = float(argv[1]) if len(argv) > 1 else 2

# 全削除
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# 形状作成
if shape == "cube":
    bpy.ops.mesh.primitive_cube_add(size=size)

elif shape == "sphere":
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size)

elif shape == "cylinder":
    bpy.ops.mesh.primitive_cylinder_add(radius=size, depth=size*2)

obj = bpy.context.object
obj.location = (0, 0, size)

# 出力
bpy.ops.export_scene.gltf(filepath="output.glb")