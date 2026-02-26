import bpy
import random
import math
import sys

# ---- Read arguments after "--"
argv = sys.argv
if "--" not in argv:
    raise Exception("No arguments provided to Blender script.")

argv = argv[argv.index("--") + 1:]

if len(argv) != 9:
    raise Exception(f"Expected 9 arguments, got {len(argv)}")

shape = argv[0]
count = int(argv[1])
size_base = float(argv[2])
size_var = float(argv[3])
r = float(argv[4])
g = float(argv[5])
b = float(argv[6])
color_var = float(argv[7])
pattern = argv[8]

print("Received args:")
print("shape:", shape)
print("count:", count)
print("size_base:", size_base)
print("size_var:", size_var)
print("pattern:", pattern)

# ---- Generate objects
for i in range(count):

    size = size_base + random.uniform(-size_var, size_var)

    # Create shape
    if shape == "cube":
        bpy.ops.mesh.primitive_cube_add(size=size)
    elif shape == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(radius=size)
    elif shape == "cylinder":
        bpy.ops.mesh.primitive_cylinder_add(radius=size, depth=size * 2)
    else:
        raise Exception(f"Unknown shape: {shape}")

    obj = bpy.context.object

    # ---- Position
    if pattern == "line":
        obj.location = (i * size * 2.5, 0, size)

    elif pattern == "circle":
        angle = (2 * math.pi / count) * i
        radius = count
        obj.location = (
            math.cos(angle) * radius,
            math.sin(angle) * radius,
            size
        )
    else:
        raise Exception(f"Unknown pattern: {pattern}")

    # ---- Material
    mat = bpy.data.materials.new(name=f"Material_{i}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]

    rv = min(max(r + random.uniform(-color_var, color_var), 0), 1)
    gv = min(max(g + random.uniform(-color_var, color_var), 0), 1)
    bv = min(max(b + random.uniform(-color_var, color_var), 0), 1)

    bsdf.inputs["Base Color"].default_value = (rv, gv, bv, 1)

    obj.data.materials.append(mat)
    bpy.ops.export_scene.gltf(filepath="output.glb")

print("Generation completed.")