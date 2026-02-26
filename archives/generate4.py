import bpy
import sys

argv = sys.argv
argv = argv[argv.index("--") + 1:]

shape = argv[0] if len(argv) > 0 else "cube"
size = float(argv[1]) if len(argv) > 1 else 2
color_name = argv[2] if len(argv) > 2 else "white"

# 色マップ
color_map = {
    "red": (1, 0, 0, 1),
    "blue": (0, 0, 1, 1),
    "green": (0, 1, 0, 1),
    "yellow": (1, 1, 0, 1),
    "white": (1, 1, 1, 1),
}

color = color_map.get(color_name, (1, 1, 1, 1))

# 全削除
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# 形状
if shape == "cube":
    bpy.ops.mesh.primitive_cube_add(size=size)

elif shape == "sphere":
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size)

elif shape == "cylinder":
    bpy.ops.mesh.primitive_cylinder_add(radius=size, depth=size*2)

obj = bpy.context.object
obj.location = (0, 0, size)

# マテリアル
mat = bpy.data.materials.new(name="Material")
mat.diffuse_color = color
obj.data.materials.append(mat)

# 出力
bpy.ops.export_scene.gltf(filepath="output.glb")