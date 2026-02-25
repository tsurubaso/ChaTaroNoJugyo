import bpy
import sys

argv = sys.argv
argv = argv[argv.index("--") + 1:]

shape = argv[0]
size = float(argv[1])
r = float(argv[2])
g = float(argv[3])
b = float(argv[4])

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

# マテリアル（ノード方式）
mat = bpy.data.materials.new(name="Material")
mat.use_nodes = True

bsdf = mat.node_tree.nodes.get("Principled BSDF")
bsdf.inputs["Base Color"].default_value = (r, g, b, 1)

obj.data.materials.append(mat)

bpy.ops.export_scene.gltf(filepath="output.glb")