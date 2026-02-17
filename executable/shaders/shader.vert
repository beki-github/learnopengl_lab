#version 430 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;
layout (location=2)   in vec2 aTex;

out vec3 cooColor;
out vec3 objColor;
out vec2 texCoord;

layout (location =0) uniform mat4 model;
layout (location =1) uniform mat4 view;
layout (location =2) uniform mat4 projection;
layout (location =3) uniform vec3 color;

void main()
    {
       gl_Position = projection*view*model*vec4(aPos.x, aPos.y, aPos.z, 1.0);
       cooColor=aColor;
       objColor=color;
       texCoord=aTex;
    }
