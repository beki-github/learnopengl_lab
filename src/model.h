#ifndef MODEL_CLASS_H
#define MODEL_CLASS_H


#include <vector>
#include <string>
#include "stb/stb_image.h"
#include "shaderClass.h"
#include "mesh.h"


#include <assimp/Importer.hpp>
#include <assimp/scene.h>
#include <assimp/postprocess.h>

class Model 
{
    public:
        Model(std::string path)
        {
            loadModel(path);
        }
        void Draw(Shader &shader);	
    private:
        // model data
        std::vector<Mesh> meshes;
        std::vector<Texture> textures_loaded;
        std::string directory;

        void loadModel(std::string path);
        void processNode(aiNode *node, const aiScene *scene);
        Mesh processMesh(aiMesh *mesh, const aiScene *scene);
        unsigned int TextureFromFile(const char *path, const std::string &directory);
        std::vector<Texture> loadMaterialTextures(aiMaterial *mat, aiTextureType type, 
                                             std::string typeName);
};

#endif
