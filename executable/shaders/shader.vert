#version 430 core

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location=2)   in vec2 aTex;




layout (location =3) uniform mat4 model;
layout (location =4) uniform mat4 view;
layout (location =5) uniform mat4 projection;


out vec2 texCoord;


void main()
    {
       gl_Position = projection*view*model*vec4(aPos.x, aPos.y, aPos.z, 1.0);
       texCoord=aTex;
    }
