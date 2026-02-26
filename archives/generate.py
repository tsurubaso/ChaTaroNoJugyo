import bpy

# 全削除
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Cube追加
bpy.ops.mesh.primitive_cube_add(size=2)
cube = bpy.context.object
cube.location = (0, 0, 1)

# マテリアル追加
mat = bpy.data.materials.new(name="RedMaterial")
mat.diffuse_color = (1, 0, 0, 1)
cube.data.materials.append(mat)

# GLB出力
bpy.ops.export_scene.gltf(filepath="output.glb")