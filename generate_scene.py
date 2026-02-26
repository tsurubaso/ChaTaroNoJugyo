import bpy
import sys
import json

argv = sys.argv
argv = argv[argv.index("--") + 1:]
scene_data = json.loads(argv[0])

# Clean
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

objects = scene_data["objects"]

for obj_data in objects:
    shape = obj_data["shape"]
    size = obj_data["size"]
    r, g, b = obj_data["color"]
    x, y, z = obj_data["position"]

    if shape == "cube":
        bpy.ops.mesh.primitive_cube_add(size=size)
    elif shape == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(radius=size)
    elif shape == "cylinder":
        bpy.ops.mesh.primitive_cylinder_add(radius=size, depth=size*2)

    obj = bpy.context.object
    obj.location = (x, y, z)

    mat = bpy.data.materials.new(name="Material")
    mat.diffuse_color = (r, g, b, 1)
    obj.data.materials.append(mat)

bpy.ops.export_scene.gltf(filepath="output.glb")